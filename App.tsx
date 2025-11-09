import React, { useState, useMemo } from 'react';
import { Player, PlayerSkill } from './types';
import { RedoIcon, ShareIcon, TrashIcon, VolleyballIcon, WinnerIcon, ClearIcon, StarIcon } from './components/icons';

const skillColors: { [key in PlayerSkill]: string } = {
  [PlayerSkill.Bom]: 'bg-green-500 border-green-400',
  [PlayerSkill.Medio]: 'bg-blue-500 border-blue-400',
  [PlayerSkill.Iniciante]: 'bg-purple-500 border-purple-400',
};

const skillWeights: { [key in PlayerSkill]: number } = {
    [PlayerSkill.Bom]: 3,
    [PlayerSkill.Medio]: 2,
    [PlayerSkill.Iniciante]: 1,
};

const SkillRating = ({ skill, className, starClassName = 'w-5 h-5' }: { skill: PlayerSkill, className?: string, starClassName?: string }) => {
    const starCount = skillWeights[skill];
    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {Array.from({ length: starCount }).map((_, index) => (
                <StarIcon key={index} className={starClassName} />
            ))}
        </div>
    );
};

const gameFormats = [
  { name: 'Dupla', players: 2 },
  { name: 'Trio', players: 3 },
  { name: 'Quinteto', players: 5 },
];

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};


export default function App() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerSkill, setNewPlayerSkill] = useState<PlayerSkill>(PlayerSkill.Medio);
    const [playersPerTeam, setPlayersPerTeam] = useState<number>(2);
    const [teams, setTeams] = useState<Player[][] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [score, setScore] = useState<{ team1: number, team2: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim() === '') return;
        setPlayers([...players, { id: Date.now().toString(), name: newPlayerName.trim(), skill: newPlayerSkill }]);
        setNewPlayerName('');
        setNewPlayerSkill(PlayerSkill.Medio);
    };

    const handleRemovePlayer = (id: string) => {
        setPlayers(players.filter(p => p.id !== id));
    };

    const handleClearAllPlayers = () => {
        if (window.confirm('Tem certeza que deseja remover todos os jogadores da lista?')) {
            setPlayers([]);
            setSearchQuery('');
        }
    };

    const handleGenerateTeams = () => {
        const numTeams = Math.floor(players.length / playersPerTeam);
        if (numTeams < 2) {
            setError(`Jogadores insuficientes para formar pelo menos 2 times de ${playersPerTeam}.`);
            setTeams(null);
            setScore(null);
            return;
        }

        setError(null);
        
        let sortedPlayers = [...players].sort((a, b) => skillWeights[b.skill] - skillWeights[a.skill]);
        
        const groupedBySkill: { [key in PlayerSkill]: Player[] } = {
            [PlayerSkill.Bom]: [],
            [PlayerSkill.Medio]: [],
            [PlayerSkill.Iniciante]: [],
        };

        sortedPlayers.forEach(p => groupedBySkill[p.skill].push(p));
        
        const shuffledBom = shuffleArray(groupedBySkill[PlayerSkill.Bom]);
        const shuffledMedio = shuffleArray(groupedBySkill[PlayerSkill.Medio]);
        const shuffledIniciante = shuffleArray(groupedBySkill[PlayerSkill.Iniciante]);
        
        const playersToDistribute = [...shuffledBom, ...shuffledMedio, ...shuffledIniciante].slice(0, numTeams * playersPerTeam);

        const newTeams: Player[][] = Array.from({ length: numTeams }, () => []);
        
        playersToDistribute.forEach((player, i) => {
            let teamIndex;
            const round = Math.floor(i / numTeams);
            if (round % 2 === 0) {
                teamIndex = i % numTeams;
            } else {
                teamIndex = numTeams - 1 - (i % numTeams);
            }
            newTeams[teamIndex].push(player);
        });

        setTeams(newTeams);
        if (newTeams.length >= 2) {
            setScore({ team1: 0, team2: 0 });
        } else {
            setScore(null);
        }
    };
    
    const handleShare = async () => {
        if (!teams) return;
        const skillStars = (skill: PlayerSkill) => '★'.repeat(skillWeights[skill]);
        let shareText = "🏐 Sorteio dos Viciados 🏐\n\n";
        teams.forEach((team, index) => {
            shareText += `Time ${index + 1}:\n`;
            team.forEach(player => {
                shareText += `- ${player.name} (${skillStars(player.skill)})\n`;
            });
            shareText += "\n";
        });

        if (score) {
             shareText += `Placar: Time 1 ${score.team1} x ${score.team2} Time 2\n`;
        }

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Sorteio dos Viciados',
                    text: shareText,
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                alert('Times copiados para a área de transferência!');
            }
        } catch (err) {
            console.error('Erro ao compartilhar:', err);
            alert('Falha ao compartilhar. Tente copiar manualmente.');
        }
    };

    const remainingPlayers = useMemo(() => {
        if (!teams) return players;
        const teamedPlayerIds = new Set(teams.flat().map(p => p.id));
        return players.filter(p => !teamedPlayerIds.has(p.id));
    }, [players, teams]);

    const filteredPlayers = useMemo(() => {
        return players.filter(player =>
            player.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [players, searchQuery]);

    const handleScoreChange = (team: 'team1' | 'team2', delta: number) => {
        if (!score) return;
        setScore(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [team]: Math.max(0, prev[team] + delta)
            }
        });
    };

    const handleResetScore = () => {
        setScore({ team1: 0, team2: 0 });
    };

    const gamePoint = 21;
    const winner = useMemo(() => {
        if (!score) return null;
        const { team1, team2 } = score;
        if (team1 >= gamePoint && team1 >= team2 + 2) return 'team1';
        if (team2 >= gamePoint && team2 >= team1 + 2) return 'team2';
        return null;
    }, [score]);


    if (teams) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
                <div className="w-full max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-yellow-400 mb-6">Times Sorteados!</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {teams.map((team, index) => (
                            <div key={index} className="bg-gray-800 border-2 border-blue-600 rounded-2xl p-6 shadow-lg transform transition-transform hover:scale-105" style={{boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'}}>
                                <h2 className="text-2xl font-bold mb-4 text-blue-400">Time {index + 1}</h2>
                                <ul className="space-y-3">
                                    {team.map(player => (
                                        <li key={player.id} className={`flex items-center justify-between p-3 rounded-lg text-white font-medium ${skillColors[player.skill]}`}>
                                            <span>{player.name}</span>
                                            <SkillRating skill={player.skill} className="text-white opacity-90" starClassName="w-4 h-4"/>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {score && teams.length >= 2 && (
                        <div className="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
                            <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">Placar do Jogo</h2>
                            <div className="flex justify-around items-start text-center">
                                <div className="w-1/2 px-2 relative">
                                    {winner === 'team1' && (
                                        <div className="flex items-center justify-center gap-1 text-lg font-bold text-yellow-300 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            <WinnerIcon className="w-6 h-6" /> Vencedor!
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-blue-400 mb-2 truncate" title="Time 1">Time 1</h3>
                                    <p className={`text-7xl font-extrabold mb-4 ${winner === 'team1' ? 'text-yellow-400' : 'text-white'}`}>{score.team1}</p>
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => handleScoreChange('team1', -1)} aria-label="Remover ponto do Time 1" className="w-12 h-12 bg-gray-700 rounded-full text-2xl font-bold hover:bg-gray-600 transition">-</button>
                                        <button onClick={() => handleScoreChange('team1', 1)} aria-label="Adicionar ponto ao Time 1" className="w-12 h-12 bg-blue-600 rounded-full text-2xl font-bold hover:bg-blue-500 transition">+</button>
                                    </div>
                                </div>
                
                                <div className="text-5xl font-light text-gray-600 pt-12">vs</div>
                
                                <div className="w-1/2 px-2 relative">
                                    {winner === 'team2' && (
                                        <div className="flex items-center justify-center gap-1 text-lg font-bold text-yellow-300 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                             <WinnerIcon className="w-6 h-6" /> Vencedor!
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-blue-400 mb-2 truncate" title="Time 2">Time 2</h3>
                                    <p className={`text-7xl font-extrabold mb-4 ${winner === 'team2' ? 'text-yellow-400' : 'text-white'}`}>{score.team2}</p>
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => handleScoreChange('team2', -1)} aria-label="Remover ponto do Time 2" className="w-12 h-12 bg-gray-700 rounded-full text-2xl font-bold hover:bg-gray-600 transition">-</button>
                                        <button onClick={() => handleScoreChange('team2', 1)} aria-label="Adicionar ponto ao Time 2" className="w-12 h-12 bg-blue-600 rounded-full text-2xl font-bold hover:bg-blue-500 transition">+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-6">
                                <button onClick={handleResetScore} className="text-gray-400 hover:text-white text-sm transition">
                                    Resetar Placar
                                </button>
                            </div>
                        </div>
                    )}

                    {remainingPlayers.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-center text-gray-400 mb-4">Jogadores de fora:</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {remainingPlayers.map(player => (
                                    <span key={player.id} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">{player.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleGenerateTeams} className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300">
                            <RedoIcon className="w-5 h-5" />
                            Refazer Sorteio
                        </button>
                        <button onClick={handleShare} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400">
                            <ShareIcon className="w-5 h-5" />
                            Compartilhar
                        </button>
                    </div>
                     <button onClick={() => { setTeams(null); setScore(null); }} className="block mx-auto mt-6 text-gray-400 hover:text-white transition">
                        Voltar para a edição
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8" style={{ background: 'radial-gradient(circle, #00102d, #000000)' }}>
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <VolleyballIcon className="w-12 h-12 text-yellow-400"/>
                      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white">
                          Sorteio dos Viciados
                      </h1>
                    </div>
                    <p className="text-lg text-blue-300">Monte times equilibrados para sua partida!</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Coluna da Esquerda: Adicionar Jogador e Formato */}
                    <div className="space-y-8">
                        {/* Adicionar Jogador */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Adicionar Jogador</h2>
                            <form onSubmit={handleAddPlayer} className="space-y-4">
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    placeholder="Nome do jogador"
                                    className="w-full bg-gray-900 text-white border-2 border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                                <fieldset className="space-y-2">
                                    <legend className="text-lg font-semibold text-gray-300 mb-2">Nível</legend>
                                    <div className="flex flex-wrap gap-3">
                                        {Object.values(PlayerSkill).map(skill => (
                                            <label key={skill} className={`flex-1 cursor-pointer flex justify-center items-center font-semibold p-3 rounded-lg border-2 transition-all ${newPlayerSkill === skill ? 'ring-2 ring-yellow-400' : ''} ${skillColors[skill]}`}>
                                                <input
                                                    type="radio"
                                                    name="skill"
                                                    value={skill}
                                                    checked={newPlayerSkill === skill}
                                                    onChange={() => setNewPlayerSkill(skill)}
                                                    className="sr-only"
                                                />
                                                <SkillRating skill={skill} className="text-white" starClassName="w-5 h-5"/>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300">
                                    Adicionar
                                </button>
                            </form>
                        </div>
                        {/* Formato do Jogo */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
                             <h2 className="text-2xl font-bold mb-4 text-yellow-400">Formato do Jogo</h2>
                             <div className="grid grid-cols-3 gap-3">
                                 {gameFormats.map(format => (
                                     <button
                                         key={format.name}
                                         onClick={() => setPlayersPerTeam(format.players)}
                                         className={`py-3 px-2 rounded-lg font-bold text-center transition-all border-2 ${playersPerTeam === format.players ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'}`}
                                     >
                                         {format.name}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>

                    {/* Coluna da Direita: Lista de Jogadores e Ação */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-yellow-400">Jogadores ({players.length})</h2>
                            {players.length > 0 && (
                                <button onClick={handleClearAllPlayers} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium p-1">
                                    <ClearIcon className="w-5 h-5" />
                                    Limpar Lista
                                </button>
                            )}
                        </div>
                         <div className="mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar jogador..."
                                className="w-full bg-gray-900 text-white border-2 border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <div className="flex-grow space-y-3 pr-2 overflow-y-auto max-h-[20rem]">
                            {players.length === 0 ? (
                                <p className="text-gray-400 text-center py-10">Nenhum jogador adicionado ainda.</p>
                            ) : filteredPlayers.length === 0 ? (
                                <p className="text-gray-400 text-center py-10">Nenhum jogador encontrado.</p>
                            ) : (
                                filteredPlayers.map(player => (
                                    <div key={player.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                                        <div>
                                            <p className="font-bold text-white">{player.name}</p>
                                            <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 mt-1 rounded-full ${skillColors[player.skill]}`}>
                                                <SkillRating skill={player.skill} className="text-white" starClassName="w-3 h-3" />
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemovePlayer(player.id)} className="text-gray-500 hover:text-red-500 transition">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-auto pt-6">
                            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                            <button onClick={handleGenerateTeams} disabled={players.length < playersPerTeam * 2} className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none">
                                Dividir Times
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
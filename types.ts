
export enum PlayerSkill {
  Bom = 'Bom',
  Medio = 'Médio',
  Iniciante = 'Iniciante',
}

export interface Player {
  id: string;
  name: string;
  skill: PlayerSkill;
}

import type {Competition} from "~/models/competition.model";
import type {Image, Meta} from "~/models/strapi.model";

export interface Player {
  id: number
  name: string
  //slug: string
  ranking: number
  first_name: string
  last_name: string
  created_at: Date
  updated_at: Date
  competitions: Competition[],
  image: Image
}

export interface PlayerResponse  {
  players: Player[]
  meta: Meta
}

export interface PlayerResponse {
  data: Player
}


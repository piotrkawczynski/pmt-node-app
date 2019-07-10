import { createModels } from "./models"

import sequelizeConfig from "./config/sequelizeConfig"

export const db = createModels(sequelizeConfig)

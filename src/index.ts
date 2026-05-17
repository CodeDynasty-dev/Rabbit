export { default_RabbitSetup } from "./default";
export { Rabbit } from "./rabbit";

//! local use

import { default_RabbitSetup } from "./default";
import { Rabbit } from "./rabbit";
// creating a rabbit instance
const BigFatRabbit = new Rabbit();
default_RabbitSetup(BigFatRabbit);
BigFatRabbit.installOn("pub");
BigFatRabbit._ActivateActions();
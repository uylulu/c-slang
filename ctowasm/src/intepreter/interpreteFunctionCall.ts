import { FunctionDefinitionP } from "~src/processor/c-ast/function";
import { Runtime } from "./types/runtime";

export default function interpreteFunctionCalls(
    Cfunction: FunctionDefinitionP,
    previousRuntime: Runtime
) : {
    runtime: Runtime[]
} {
    const res: Runtime[] = [];
    return { runtime: res };
}
// evaluates a series of expressions and statements in a runtime object
import { CNodeP, ExpressionP, StatementP } from "~src/processor/c-ast/core";
import { Runtime } from "./types/runtime";
import { interpreteExpression } from "./interpreteExpression";


// Determines if the instruction is a statement or an expression
export function getInstructionType(instruction: ExpressionP | StatementP): "statement" | "expression" {
    if("isExpression" in instruction) {
        return "expression";
    }
    return "statement";
}

export default function evaluator(
    currentRuntime: Runtime
) : Runtime[] {
    const temp : Runtime[] = [];
    
    if(currentRuntime.empty()) {
        return [];
    } else {
        const {newRuntime, topInstruction} = currentRuntime.popInstruction();

        if(getInstructionType(topInstruction) === "statement") {
            const interpretedRuntime : Runtime[] = interpreteExpression(topInstruction, newRuntime);

        }
    }


    return temp;
}
// evaluates a series of expressions and statements in a runtime object
import { CNodeP, ExpressionP, StatementP } from "~src/processor/c-ast/core";
import { Runtime } from "./types/runtime";
import { interpreteExpression } from "./interpreteExpression";
import interpreteStatement from "./interpreteStatement";


// Determines if the instruction is a statement or an expression
export function getInstructionType(instruction: ExpressionP | StatementP): "statement" | "expression" {
    if("isExpression" in instruction) {
        return "expression";
    }
    return "statement";
}

export const expressionTypes = new Set<String> ([
    "BinaryExpression",
    "IntegerConstant",
    "FloatConstant",
    "PreStatementExpression",
    "PostStatementExpression",
    "UnaryExpression",
    "LocalAddress",
    "DataSegmentAddress",
    "DynamicAddress",
    "ReturnObjectAddress",
    "FunctionTableIndex",
    "MemoryLoad",
    "ConditionalExpression",
    "TypeCastingExpression"
]);

export const statementTypes = new Set<String> ([
    "MemoryStore",
    "SelectionStatement",
    "DoWhileLoop",
    "WhileLoop",
    "ForLoop",
    "FunctionCall",
    "ReturnStatement",
    "BreakStatement",
    "ContinueStatement",
    "MemoryStore",
    "SwitchStatement"
]);

export function isExpression(instruction: CNodeP): instruction is ExpressionP {
    return expressionTypes.has(instruction.type);
}

export function isStatement(instruction: CNodeP): instruction is StatementP {
    return statementTypes.has(instruction.type);
}

export default function evaluator(
    currentRuntime: Runtime
) : Runtime[] {
    let res: Runtime[] = [currentRuntime];

    while(!res[res.length - 1].empty()) {
        const {newRuntime, topInstruction} = currentRuntime.popInstruction();

        if(isExpression(topInstruction)) {
            const interpretedRuntime : Runtime = interpreteExpression(topInstruction, newRuntime);
            res.push(interpretedRuntime);

        } else if(isStatement(topInstruction)) {
            const interpretedRuntime : Runtime = interpreteStatement(topInstruction, newRuntime);
            res.push(interpretedRuntime);            

        } else {
            throw new Error("Failed to evaluate: Unknown instruction type");
        }
    }

}
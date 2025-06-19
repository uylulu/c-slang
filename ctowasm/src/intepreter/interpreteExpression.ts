import { ScalarCDataType } from "~src/common/types";
import { ExpressionP } from "~src/processor/c-ast/core";
import { Runtime } from "./types/runtime";
import interpreteStatement from "./interpreteStatement";

export function interpreteExpression (
    expr: ExpressionP,
    currentRuntime: Runtime,
) : Runtime[] {
    const temp : Runtime[] = []; // To be replaced by actual implementation.

    if(expr.type === "BinaryExpression") {
        // Write a binary expression interpreter
        return temp;
    } else if (
        expr.type === "IntegerConstant" ||
        expr.type === "FloatConstant"
    ) {
        // push constant onto the stash
        return [currentRuntime.pushConstantToStack(expr)];
    } else if (expr.type === "PreStatementExpression") {
        // interprete statements
        
    }
    return temp;
}
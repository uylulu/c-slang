import { ScalarCDataType } from "~src/common/types";
import { ExpressionP } from "~src/processor/c-ast/core";
import { Runtime } from "./types/runtime";
import interpreteStatement from "./interpreteStatement";
import evaluator from "./evaluator";

export function interpreteExpression (
    expr: ExpressionP,
    currentRuntime: Runtime,
) : Runtime {

    if(expr.type === "BinaryExpression") {
        // Write a binary expression interpreter
        return currentRuntime;
    } else if (
        expr.type === "IntegerConstant" ||
        expr.type === "FloatConstant"
    ) {
        // push constant onto the stash
        return currentRuntime.pushConstantToStack(expr);

    } else if (expr.type === "PreStatementExpression") {
        // expression goes in first, and then statements
        const newRuntime = currentRuntime.pushExpressionsToControlStack([expr.expr])
                                         .pushStatementsToControlStack(expr.statements); 
        return newRuntime;
    } else if (expr.type === "PostStatementExpression") {
        
        // statements goes in first, and then expression
        const newRuntime = currentRuntime.pushStatementsToControlStack(expr.statements)
                                         .pushExpressionsToControlStack([expr.expr]);
        return newRuntime;
    } else if (expr.type === "UnaryExpression") {

    }

    return currentRuntime
}
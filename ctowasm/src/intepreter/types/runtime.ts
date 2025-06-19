import { Address } from "~src/processor/c-ast/memory";
import { Memory } from "./memory";
import { ConstantP } from "~src/processor/c-ast/expression/constants";
import { ExpressionP, StatementP } from "~src/processor/c-ast/core";


// Runtime class that encapsulates all characteristics of a snap shot
// This class is immutable
export class Runtime {
    readonly control: (StatementP | ExpressionP)[];
    readonly stash: (Address | ConstantP)[];
    readonly memory: Memory;

    constructor(control: (StatementP | ExpressionP)[], memory: Memory, stash? : (Address | ConstantP)[]) {
        this.control = control;
        this.stash = stash ?? [];
        this.memory = memory;
    }

    pushStatementsToControlStack(statements: StatementP[]) : Runtime {
        const newControl = [...this.control];
        
        // Control is a stack so we need to loop backwards to push elements in
        for(let i = statements.length - 1;i >= 0;i--) {
            newControl.push(statements[i]);
        }

        const newRuntime = new Runtime(newControl, this.memory, this.stash);
        return newRuntime;
    }

    pushExpressionsToControlStack(expressions: ExpressionP[]) : Runtime {
        const newControl = [...this.control];

        // Control is a stack so we need to loop backwards to push elements in
        for(let i = expressions.length - 1;i >= 0;i--) {
            newControl.push(expressions[i]);
        }

        const newRuntime = new Runtime(newControl, this.memory, this.stash);
        return newRuntime;
    }
 
    pushInstrunctionsToControlStack(statements: (StatementP | ExpressionP)[]) : Runtime {
        const newRuntime = new Runtime(this.control.concat(statements), this.memory, this.stash);

        return newRuntime;
    }

    pushConstantToStack(val: Address | ConstantP) : Runtime {
        const newRuntime = new Runtime([...this.control], this.memory, [...this.stash, val]);

        return newRuntime;
    }

    // Pops the top most instruction
    popInstruction() : {
        newRuntime: Runtime,
        topInstruction: StatementP | ExpressionP 
    } {
        if(this.control.length === 0) {
            return {
                newRuntime: new Runtime([], this.memory, this.stash), 
                topInstruction: null as unknown as StatementP | ExpressionP
            };
        }

        const topInstruction = this.control[this.control.length - 1];
        const newControl = this.control.slice(0, -1);

        return {
            newRuntime: new Runtime(newControl, this.memory, this.stash),
            topInstruction: topInstruction
        };
    }

    empty() : boolean {
        return this.control.length === 0;
    }
}
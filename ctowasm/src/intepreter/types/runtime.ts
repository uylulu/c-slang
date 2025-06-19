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

    pushConstantToStack(val: Address | ConstantP) : Runtime {
        const newMemory = this.memory.clone(); 
        const newRuntime = new Runtime([...this.control], newMemory, [...this.stash, val]);

        return newRuntime;
    }

    // Pops the top most instruction
    popInstruction() : {
        newRuntime: Runtime,
        topInstruction: StatementP | ExpressionP 
    } {
        const newMemory = this.memory.clone();
        if(this.control.length === 0) {
            return {
                newRuntime: new Runtime([], newMemory, [...this.stash]), 
                topInstruction: null as unknown as StatementP | ExpressionP
            };
        }

        const topInstruction = this.control[this.control.length - 1];
        const newControl = this.control.slice(0, -1);

        return {
            newRuntime: new Runtime(newControl, newMemory, [...this.stash]),
            topInstruction: topInstruction
        };
    }

    empty() : boolean {
        return this.control.length === 0;
    }
}
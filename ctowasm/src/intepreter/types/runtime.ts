// A runtime class for the interpreter which encapsulates the memory 
import { checkAndExpandMemoryIfNeeded } from "~src/modules/util";

import { KB, WASM_PAGE_IN_HEX } from "~src/common/constants";
import { calculateNumberOfPagesNeededForBytes } from "~src/common/utils";
import { WASM_ADDR_TYPE } from "~src/translator/memoryUtil";
import { SharedWasmGlobalVariables } from "~src/modules";

export function parseDataSegmentByteStr(dataSegmentByteStr: string) : Uint8Array {
    const matches = dataSegmentByteStr.match(/\\([0-9a-fA-F]{2})/g)
    const bytes = matches?.map(byteStr => byteStr.slice(2));
    console.log(matches);
    console.log("FUKK");
    console.log(bytes)

    return new Uint8Array;
}

// state that the programm go through at run time
export class Runtime {
    memory: WebAssembly.Memory;
    view: DataView;
    
    dataSegmentSizeInBytes: number;
    dataSegmentByteStr: string;
    heapBuffer: number // Heap size limit in bytes
    stackBuffer: number // Stacks size limit in bytes

    sharedWasmGlobalVariables: SharedWasmGlobalVariables;

    // Constructor to initiate the first runtime object
    constructor(
        dataSegmentByteStr: string, // The string of bytes (each byte is in the form "\\XX" where X is a digit in base-16) to initialize the data segment with, determined by processing initializers for data segment variables.
        dataSegmentSizeInBytes: number,
        heapBuffer?: number,
        stackBuffer?: number
    ) {
        this.dataSegmentSizeInBytes = dataSegmentSizeInBytes;
        this.dataSegmentByteStr = dataSegmentByteStr
        this.heapBuffer = heapBuffer ?? 32 * KB;
        this.stackBuffer = stackBuffer ?? 32 * KB;

        const totalMemory = this.dataSegmentSizeInBytes + this.heapBuffer + this.stackBuffer;
        const initialPages = calculateNumberOfPagesNeededForBytes(totalMemory);

        this.memory = new WebAssembly.Memory({ initial: initialPages });
        this.view = new DataView(this.memory.buffer);

        this.sharedWasmGlobalVariables = {
            stackPointer: new WebAssembly.Global(
                { value: WASM_ADDR_TYPE, mutable: true },
                WASM_PAGE_IN_HEX * initialPages,
            ),
            basePointer: new WebAssembly.Global(
                { value: WASM_ADDR_TYPE, mutable: true },
                0,
            ),
            heapPointer: new WebAssembly.Global(
                { value: WASM_ADDR_TYPE, mutable: true },
                dataSegmentSizeInBytes + 4,
            )
        };

        // Initiate the data segment
        console.log("TODO: Initiate the data segment")
        parseDataSegmentByteStr(dataSegmentByteStr);
        
    }
}
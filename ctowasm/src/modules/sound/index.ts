import { WASM_ADDR_SIZE } from "~src/common/constants";
import { primaryDataTypeSizes } from "~src/common/utils";
import { ModulesGlobalConfig, SharedWasmGlobalVariables } from "~src/modules";
import { voidDataType } from "~src/modules/constants";
import {
  freeFunction,
  mallocFunction,
} from "~src/modules/source_stdlib/memory";
import wrapFunctionPtrCall from "~src/modules/stackFrameUtils";
import { Module, ModuleFunction, StackFrameArg } from "~src/modules/types";
import {
  extractCStyleStringFromMemory,
  getExternalFunction,
} from "~src/modules/util";
import { StructDataType } from "~src/parser/c-ast/dataTypes";
import { compileWatToWasm } from "~src/wat-to-wasm";

export const soundLibraryModuleImportName = "sound";

export class SoundLibraryModule extends Module {
  moduleDeclaredStructs: StructDataType[];
  moduleFunctions: Record<string, ModuleFunction>;
  sharedWasmGlobalVariables: SharedWasmGlobalVariables;

  constructor(
    memory: WebAssembly.Memory,
    functionTable: WebAssembly.Table,
    config: ModulesGlobalConfig,
    sharedWasmGlobalVariables: SharedWasmGlobalVariables,
  ) {
    super(memory, functionTable, config, sharedWasmGlobalVariables);
    this.sharedWasmGlobalVariables = sharedWasmGlobalVariables;
    this.moduleDeclaredStructs = [];
    this.moduleFunctions = {
      play_wave: {
        parentImportedObject: soundLibraryModuleImportName,
        functionType: {
            type: "function",
            parameters: [
                {
                    type: "pointer",
                    pointeeType: {
                        type: "function",
                        parameters: [
                            {
                                type: "primary",
                                primaryDataType: "double"
                            }
                        ],
                        returnType: {
                            type: "primary",
                            primaryDataType: "double"
                        }
                    }
                },
                {
                    type: "primary",
                    primaryDataType: "double"
                },
            ],
            returnType: voidDataType,
        },
        jsFunction: (funcPtr : number, duration: number) => {
          const wave = (t : number) => {
            const stackFrameArgs: StackFrameArg[] = [
              {
                  value: Number(t),
                  type: "double"
              },
            ]

            const returnValues = wrapFunctionPtrCall(
              memory,
              functionTable,
              funcPtr,
              sharedWasmGlobalVariables,
              stackFrameArgs,
              ["double"],
            );

            return returnValues[0];
          }
          getExternalFunction("play_wave", config)(wave, duration);
        },
      },
        make_sound: {
            parentImportedObject: soundLibraryModuleImportName,
            functionType: {
                type: "function",
                parameters: [
                    {
                        type: "pointer",
                        pointeeType: {
                            type: "function",
                            parameters: [
                                {
                                    type: "primary",
                                    primaryDataType: "double"
                                }
                            ],
                            returnType: {
                                type: "primary",
                                primaryDataType: "double"
                            }
                        }
                    },
                    {
                        type: "primary",
                        primaryDataType: "double"
                    }
                ],
                returnType: {
                    type: "struct",
                    tag: "Sound",
                    fields: [
                        {
                            tag: "funcPtr",
                            dataType: {
                                type: "pointer",
                                pointeeType: {
                                    type: "function",
                                    parameters: [
                                        {
                                            type: "primary",
                                            primaryDataType: "double"
                                        }
                                    ],
                                    returnType: {
                                        type: "primary",
                                        primaryDataType: "double"
                                    }
                                }
                            },
                            isConst: false
                        },
                        {
                            tag: "duration",
                            dataType: {
                                type: "primary",
                                primaryDataType: "double"
                            },
                            isConst: false
                        }
                    ]
                }
            },
            jsFunction: (funcPtr: number, duration: number)=>{
                return [
                    funcPtr, duration
                ];
            }
        },
        play: {
            parentImportedObject: soundLibraryModuleImportName,
            functionType: {
                type: "function",
                parameters: [
                    {
                        type: "struct",
                        tag: "Sound",
                        fields: [
                            {
                                tag: "funcPtr",
                                dataType: {
                                    type: "pointer",
                                    pointeeType: {
                                        type: "function",
                                        parameters: [
                                            {
                                                type: "primary",
                                                primaryDataType: "double"
                                            }
                                        ],
                                        returnType: {
                                            type: "primary",
                                            primaryDataType: "double"
                                        }
                                    }
                                },
                                isConst: false
                            },
                            {
                                tag: "duration",
                                dataType: {
                                    type: "primary",
                                    primaryDataType: "double"
                                },
                                isConst: false
                            }
                        ]
                    }
                ],
                returnType: voidDataType,
            }, jsFunction: (funcPtr: number, duration: number) => {
                const wave = (t: number) => {
                    const stackFrameArgs: StackFrameArg[] = [
                        {
                            value: Number(t),
                            type: "double"
                        },
                    ]
                    const returnValues = wrapFunctionPtrCall(
                        memory,
                        functionTable,
                        funcPtr,
                        sharedWasmGlobalVariables,
                        stackFrameArgs,
                        ["double"],
                    );
                    return returnValues[0];
                };
                getExternalFunction("play", config)([wave, duration]);
            }
        },
        consect_two: {
            parentImportedObject: soundLibraryModuleImportName,
            functionType: {
                type: "function",
                parameters: [
                    {
                        type: "struct",
                        tag: "Sound",
                        fields: [
                            {
                                tag: "funcPtr",
                                dataType: {
                                    type: "pointer",
                                    pointeeType: {
                                        type: "function",
                                        parameters: [
                                            {
                                                type: "primary",
                                                primaryDataType: "double"
                                            }
                                        ],
                                        returnType: {
                                            type: "primary",
                                            primaryDataType: "double"
                                        }
                                    }
                                },
                                isConst: false
                            },
                            {
                                tag: "duration",
                                dataType: {
                                    type: "primary",
                                    primaryDataType: "double"
                                },
                                isConst: false
                            }
                        ]
                    },
                    {
                        type: "struct",
                        tag: "Sound",
                        fields: [
                            {
                                tag: "funcPtr",
                                dataType: {
                                    type: "pointer",
                                    pointeeType: {
                                        type: "function",
                                        parameters: [
                                            {
                                                type: "primary",
                                                primaryDataType: "double"
                                            }
                                        ],
                                        returnType: {
                                            type: "primary",
                                            primaryDataType: "double"
                                        }
                                    }
                                },
                                isConst: false
                            },
                            {
                                tag: "duration",
                                dataType: {
                                    type: "primary",
                                    primaryDataType: "double"
                                },
                                isConst: false
                            }
                        ]
                    }
                ],
                returnType: {
                    type: "struct",
                    tag: "Sound",
                    fields: [
                        {
                            tag: "funcPtr",
                            dataType: {
                                type: "pointer",
                                pointeeType: {
                                    type: "function",
                                    parameters: [
                                        {
                                            type: "primary",
                                            primaryDataType: "double"
                                        }
                                    ],
                                    returnType: {
                                        type: "primary",
                                        primaryDataType: "double"
                                    }
                                }
                            },
                            isConst: false
                        },
                        {
                            tag: "duration",
                            dataType: {
                                type: "primary",
                                primaryDataType: "double"
                            },
                            isConst: false
                        }
                    ]
                }
            },
            jsFunction: (funcPtr1: number, duration1: number, funcPtr2: number, duration2: number) => {
                const consected_wave = () => {
                    // take t on the stack
                    const firstArgOffset = this.sharedWasmGlobalVariables.stackPointer.value;
                    const dataView = new DataView(memory.buffer, firstArgOffset);
                    const t = dataView.getFloat64(0, true);
                    // get the value of the first number on the stack

                    if(t < duration1) {
                        const stackFrameArgs: StackFrameArg[] = [
                            {
                                value: Number(t),
                                type: "double"
                            },
                        ]
                        const returnValues = wrapFunctionPtrCall(
                            memory,
                            functionTable,
                            funcPtr1,
                            sharedWasmGlobalVariables,
                            stackFrameArgs,
                            ["double"],
                        );
                        const res = returnValues[0];
                        const returnValuesOffSet = sharedWasmGlobalVariables.basePointer.value + WASM_ADDR_SIZE;

                        const returnDataView = new DataView(memory.buffer, returnValuesOffSet, 8); 
                        returnDataView.setFloat64(0, Number(res), true);

                    } else if(t < duration1 + duration2) {
                        const stackFrameArgs: StackFrameArg[] = [
                            {
                                value: Number(t - duration1),
                                type: "double"
                            },
                        ]
                        const returnValues = wrapFunctionPtrCall(
                            memory,
                            functionTable,
                            funcPtr2,
                            sharedWasmGlobalVariables,
                            stackFrameArgs,
                            ["double"],
                        );
                        const res = returnValues[0];

                        const returnValuesOffSet = sharedWasmGlobalVariables.basePointer.value + WASM_ADDR_SIZE;

                        const returnDataView = new DataView(memory.buffer, returnValuesOffSet, 8); 
                        returnDataView.setFloat64(0, Number(res), true);
                    }
                    return 0;
                }
                
                const base64BinaryString = "AGFzbQEAAAABBgFgAXwBfAIHAQFtAWYAAAcFAQFmAAA="

                // decode base64 string to Uint8Array
                const binary = new Uint8Array(atob(base64BinaryString).split("").map((c) => c.charCodeAt(0)));
                let instance = new WebAssembly.Instance(new WebAssembly.Module(binary), {
                    m: {
                        f: consected_wave
                    }
                });

                const newWasmFunction = instance.exports.f;

                const newFuncPtr = this.functionTable.length;
                this.functionTable.grow(1);
                this.functionTable.set(newFuncPtr, newWasmFunction);

                return [newFuncPtr, duration1 + duration2];
            }
        }
        
    
    };
  }
}
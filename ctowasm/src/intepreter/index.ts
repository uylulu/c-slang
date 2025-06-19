import { CAstRootP } from "~src/processor/c-ast/core";
import { Memory } from "./types/memory";
import { WASM_ADDR_TYPE } from "~src/translator/memoryUtil";
import { ModuleName } from "~src/modules";
import { Runtime } from "./types/runtime";

export default function interprete(
  astRootNode: CAstRootP,
  includedModules: ModuleName[],
) : {
  runtime: Runtime[],
} {
  const temp = new Memory(
    astRootNode.dataSegmentByteStr,
    astRootNode.dataSegmentSizeInBytes
  );

  const mainFunc = astRootNode.functions.find(func => func.name == "main");
  if (!mainFunc) {
    throw new Error("Main function not defined");
  }

  const res : Runtime[] = [
    new Runtime(
      mainFunc.body,
      temp
    )
  ];

  return {runtime : res};
}
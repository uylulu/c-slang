import { CAstRootP } from "~src/processor/c-ast/core";
import { Runtime } from "./types/runtime";
import { WASM_ADDR_TYPE } from "~src/translator/memoryUtil";
import { ModuleName } from "~src/modules";

export default function interprete(
  astRootNode: CAstRootP,
  includedModules: ModuleName[],
) : {
  runtime: Runtime[],
} {
  const res : Runtime[] = [
    new Runtime(
      astRootNode.dataSegmentByteStr,
      astRootNode.dataSegmentSizeInBytes,
    )
  ];
  console.log("HERE");
  console.log(astRootNode);

  return {runtime : res};
}
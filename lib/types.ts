//TODO: ROAD MAP EDITOR ACTIONS

export type BEHAVIOR_TYPES =
  | "Bold"
  | "Color"
  | "BackgroundColor"
  | "Italic"
  | "Underline"
  | "Strikethrough"
  | "Superscript"
  | "Subscript"
  | "FontFamily"
  | "FontSize"
  | "FontColor"
  | "Highlight"
  | "Alignment"
  | "Indentation"
  | "OrderedList"
  | "UnorderedList"
  | "Asset"
  | "Link"
  | "Image"
  | "Undo"
  | "Redo"
  | "Cut"
  | "Copy"
  | "Paste"
  | "ClearFormatting"
  | "SubmenuTools"
  | "Save"
  | "Print"
  | "FindReplace"
  | "FullScreen"
  | "SpellCheck"
  | "InsertSpecialCharacters"
  | "custom"
  | "FormatPainter";

export type ACTION_TYPES =
  | "input"
  | "paste"
  | "copy"
  | "click"
  | "contextmenu"
  | "focus"
  | "document-selectionchange"
  | SyntheticAction
  | DocumentAction;

export type DocumentAction = `document-${string}`;
export type SyntheticAction = `synthetic-${string}`;

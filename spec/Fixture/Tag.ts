import * as TagRow from "../../Api/src/Database/TagRow"
import { _notNull } from "./Maybe"
import { createTagName } from "../../Core/App/TagName"
import { createNow } from "../../Core/Data/Timestamp"
import { createText256 } from "../../Core/Data/Text"

export async function _createTag(
  tagS: string,
  tagData?: Partial<TagRow.TagRow>,
): Promise<TagRow.TagRow> {
  const now = createNow()

  return TagRow.unsafeCreate({
    name: _notNull(createTagName(tagS)),
    description: _notNull(createText256("Default tag description")),
    createdAt: now,
    updatedAt: now,
    ...tagData,
  })
}

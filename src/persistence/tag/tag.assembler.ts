import { Tag } from 'src/entities/tag.entity';
import { RecordAssembler } from '../record.assembler';
import { TagRecord } from './tag.record';

export class TagAssembler extends RecordAssembler<TagRecord, Tag> {
  assemble(record: TagRecord): Promise<Tag> {
    if (record === null) return Promise.resolve(null);
    const { _typeName, _identifierProperty, ...tag } = record;
    return Promise.resolve(tag);
  }

  flatten = (tag: Tag): Promise<TagRecord> =>
    Promise.resolve({
      _typeName: 'tag',
      _identifierProperty: 'identifier',
      ...tag,
    });
}

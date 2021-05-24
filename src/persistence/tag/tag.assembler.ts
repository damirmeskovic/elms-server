import { Tag } from 'src/entities/tag.entity';
import { RecordAssembler } from '../record.assembler';
import { TagRecord } from './tag.record';
import { Persistence } from '../persistence';

export class TagAssembler extends RecordAssembler<TagRecord, Tag> {
  constructor(private readonly persistence: Persistence) {
    super();
  }

  assemble(record: TagRecord): Promise<Tag> {
    throw new Error('Method not implemented.');
  }

  flatten(type: Tag): Promise<TagRecord> {
    throw new Error('Method not implemented.');
  }
}

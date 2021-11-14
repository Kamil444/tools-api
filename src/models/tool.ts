import { Model, Schema, model } from 'mongoose';
import { DbDocumentBasic } from '../types/db-document-basic';

export interface ITool extends DbDocumentBasic {
  /** _id */
  _id?: string;
  /** Name of the tool */
  name: string;
  /** Type of the tool */
  typeOfTool: string;
  /** Quantity of the tool */
  quantity: number;
  /** Number of the junk */
  junkQuantity: number;
  /** Number of the tool cabinet */
  toolCabinetNumber: number;
  /** Number of the tool shelf */
  toolShelfNumber: number;
  /** Number of the tool position */
  toolPosition: number;
}

interface IToolModel extends Model<ITool> { }

const schema = new Schema<ITool>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    typeOfTool: { type: String, required: true },
    quantity: { type: Number, required: true },
    junkQuantity: { type: Number, required: true },
    toolCabinetNumber: { type: Number, required: false },
    toolShelfNumber: { type: Number, required: false },
    toolPosition: { type: Number, required: false },
    updatedAt: { type: Number, required: true, default: Date.now },
    createdAt: { type: Number, required: true, default: Date.now }   
});

const Tool: IToolModel = model<ITool, IToolModel>('tools', schema);

export { Tool };

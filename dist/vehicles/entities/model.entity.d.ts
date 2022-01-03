import { BaseEntity } from 'typeorm';
import { VehicleMake } from './make.entity';
export declare class Model extends BaseEntity {
    id: number;
    modelName: string;
    makeId: number;
    make: VehicleMake;
}

import { IsEnum } from "class-validator";
import { SectionStatus } from "src/entities/section.entity";

export class ChangeSectionsStatusDto{

    @IsEnum(SectionStatus)
    status! : SectionStatus;
    

}
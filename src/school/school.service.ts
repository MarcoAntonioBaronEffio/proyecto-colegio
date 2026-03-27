import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from 'src/entities/grade.entity';
import { Section } from 'src/entities/section.entity';
import { CreateSectionDto } from 'src/section/dto/create-section.dto';
import { QueryFailedError, Repository } from 'typeorm';

// 🧩 Declaramos el servicio y lo hacemos inyectable en NestJS
@Injectable()
export class SchoolService {

    


}
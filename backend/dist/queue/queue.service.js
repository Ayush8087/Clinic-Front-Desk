"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const queue_entity_1 = require("./queue.entity");
let QueueService = class QueueService {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }
    async getNextQueueNumber() {
        const lastEntry = await this.queueRepository.findOne({
            where: {},
            order: { queueNumber: 'DESC' },
        });
        return lastEntry ? lastEntry.queueNumber + 1 : 1;
    }
    async addToQueue(patientName, priority = queue_entity_1.PatientPriority.NORMAL, doctorId) {
        const queueNumber = await this.getNextQueueNumber();
        const newEntry = this.queueRepository.create({
            patientName,
            queueNumber,
            priority,
            doctorId: doctorId || null,
        });
        return this.queueRepository.save(newEntry);
    }
    findAll() {
        return this.queueRepository
            .createQueryBuilder('queueEntry')
            .leftJoinAndSelect('queueEntry.doctor', 'doctor')
            .orderBy("CASE WHEN queueEntry.status = 'Completed' THEN 1 ELSE 0 END", "ASC")
            .addOrderBy('queueEntry.priority', 'DESC')
            .addOrderBy('queueEntry.arrivalTime', 'ASC')
            .getMany();
    }
    async updateStatus(id, status) {
        await this.queueRepository.update(id, { status });
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new common_1.NotFoundException(`Queue entry with ID "${id}" not found`);
        }
        return entry;
    }
    async prioritize(id) {
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new common_1.NotFoundException(`Queue entry with ID "${id}" not found`);
        }
        entry.priority = queue_entity_1.PatientPriority.URGENT;
        return this.queueRepository.save(entry);
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(queue_entity_1.QueueEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QueueService);
//# sourceMappingURL=queue.service.js.map
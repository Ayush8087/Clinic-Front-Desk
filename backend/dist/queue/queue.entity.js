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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueEntry = exports.PatientPriority = exports.QueueStatus = void 0;
const typeorm_1 = require("typeorm");
const doctor_entity_1 = require("../doctors/doctor.entity");
var QueueStatus;
(function (QueueStatus) {
    QueueStatus["WAITING"] = "Waiting";
    QueueStatus["WITH_DOCTOR"] = "With Doctor";
    QueueStatus["COMPLETED"] = "Completed";
})(QueueStatus || (exports.QueueStatus = QueueStatus = {}));
var PatientPriority;
(function (PatientPriority) {
    PatientPriority["NORMAL"] = "Normal";
    PatientPriority["URGENT"] = "Urgent";
})(PatientPriority || (exports.PatientPriority = PatientPriority = {}));
let QueueEntry = class QueueEntry {
};
exports.QueueEntry = QueueEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QueueEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QueueEntry.prototype, "patientName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], QueueEntry.prototype, "queueNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QueueStatus,
        default: QueueStatus.WAITING,
    }),
    __metadata("design:type", String)
], QueueEntry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PatientPriority,
        default: PatientPriority.NORMAL,
    }),
    __metadata("design:type", String)
], QueueEntry.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QueueEntry.prototype, "arrivalTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => doctor_entity_1.Doctor, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'doctorId' }),
    __metadata("design:type", doctor_entity_1.Doctor)
], QueueEntry.prototype, "doctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QueueEntry.prototype, "doctorId", void 0);
exports.QueueEntry = QueueEntry = __decorate([
    (0, typeorm_1.Entity)()
], QueueEntry);
//# sourceMappingURL=queue.entity.js.map
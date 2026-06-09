import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnChanges {
  @Input() task: Appointment | undefined;
  @Input() index: number | undefined;
  @Output() editAppointment = new EventEmitter<number>();
  @Output() deleteAppointment = new EventEmitter<number>();
  @Output() toggleComplete = new EventEmitter<{
    index: number;
    completed: boolean;
  }>();

  onEdit(): void {
    if (this.index !== undefined) {
      this.editAppointment.emit(this.index);
    }
  }

  onDelete(): void {
    if (this.index !== undefined) {
      this.deleteAppointment.emit(this.index);
    }
  }

  onToggleComplete(checked: boolean): void {
    if (this.index !== undefined) {
      this.toggleComplete.emit({ index: this.index, completed: checked });
    }
  }

  onImgError(): void {
    this.imgFailed = true;
  }

  // Inline SVG data URI used as a reliable offline placeholder (no network request)
  readonly placeholderDataUrl: string = (() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect fill='%23e0e0e0' width='100' height='100'/><text x='50' y='55' font-size='12' text-anchor='middle' fill='%23888'>No Image</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  })();

  imgFailed = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.imgFailed = false;
    }
  }
}

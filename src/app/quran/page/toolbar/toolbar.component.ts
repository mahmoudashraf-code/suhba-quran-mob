import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {

  constructor(
    public popoverController: PopoverController,
  ) { }
  emit(e: Event, event: string) {
    e.stopPropagation()
    this.popoverController.dismiss(event)
  }
}

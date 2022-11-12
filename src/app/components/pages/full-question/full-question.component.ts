import { Component } from '@angular/core';
import { Question } from 'src/app/classes/dto/question/question';
import { Space } from 'src/app/classes/dto/space/space';
import answerConfig from 'src/app/configs/answer-config';
import commentConfig from 'src/app/configs/comment-config';
import questionConfig from 'src/app/configs/question-config';

@Component({
  selector: 'app-full-question',
  templateUrl: './full-question.component.html',
  styleUrls: ['./full-question.component.scss']
})
export class FullQuestionComponent {
  public window: Window = window;
  public spaceAllowed: boolean = false;
  public space !: Space;
  public question !: Question;
  public questionWidth: number = questionConfig.width;
  public answerWidth: number = answerConfig.width;
  public commentWidth: number = commentConfig.width;
  public answerHeight: number = answerConfig.minHeight;
  public commentHeight: number = commentConfig.minHeight;

  constructor() { }

  public setSpaceAllowed(result: any): void {
    this.spaceAllowed = true;
    this.space = result.space;
    this.question = result.question;
    
    document.title = `${this.question.title}`;
  }
}

export class Question{
    question:string
    answers:string[]
    rightAnswer:number
    constructor(question:string,answers:string[],rightAnswer:number){
        this.question = question;
        this.answers = answers;
        this.rightAnswer = rightAnswer;
    }
}
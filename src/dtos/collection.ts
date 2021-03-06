import { Principal } from "./principal";
import { Question } from "./question";

export class Collections {

    id: string;
    key_: number;
    title: string; 
    description: string;
    category: string;
    author: Principal;
    questionList: Question[];

    constructor(id: string, key_: number, ct: string, cd: string, cc: string, ca: Principal) {
        this.id = id;
        this.key_ = key_;
        this.title = ct;
        this.description = cd;
        this.category = cc;
        this.author = ca;
        this.questionList = [];
    }

}
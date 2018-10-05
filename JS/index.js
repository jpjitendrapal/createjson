function Question(id, text, options) {
    this.id = id;
    this.text = text;
    this.options = options;
}
Question.prototype = {
    addAnswer: function (id, ans) {
        // ans = {id:1,text: "Answer1"}
        this.options.push(ans);
    },
    deleteAnswer: function (id) {
        for (var i = 0; i < this.options; i++) {
            if (id == this.options[i].id) {
                this.options.splice(i, 1);
                break;
            }
        }
    },
    renderQuestion: function () {
        var htm;
        htm = "<div data-id='" + this.id + "' class='question'>" +
              "<div onclick='qlist.deleteQuestion(" + this.id + ");updateHtml();' data-qid='"+ this.id +"' class='delete'>X</div>"+
            "<input class='q-text' type='text' value='" + this.text + "'>" +
            this.renderOptions() +
            "</div>";

        return htm;
    },
    renderOptions: function () {
        var htm;
        htm = "<div class='options'>";
        for (var i = 0; i < this.options.length; i++) {
            htm += "<div data-id='" + this.options[i].id + "' class='ans'>" +
                "<input data-ansid='" + this.options[i].id + "' type='radio' name='option" + this.id + "' /><input class='ans-text' type='text' value='" + this.options[i].text + "'/></div>";
        }
        htm += "</div>";
        return htm;
    },
    updateQuestion() {
        var qnode = document.querySelectorAll(".question[data-id='" + this.id + "'] .q-text");
        if (qnode && qnode[0]) {
            this.text = qnode[0].value;
        }
    },
    updateOptions: function () {
        var ansnode;
        for (var i = 0; i < this.options.length; i++) {
            ansnode = document.querySelectorAll(".question[data-id='" + this.id + "'] .options [data-id='" + this.options[i].id + "'] .ans-text");
            this.options[i].text = ansnode[0].value;
        }
    }
}

//
function QuestionList() {
    this.questions = []; // {id:1, "what is question",["ans 1","ans 2"]}
    
}
QuestionList.prototype = {
    idlist: [],
    addQuestion: function (question) {
        if (question) {
            this.questions.push(question);
        } else {
            this.idlist.push(this.idlist.length+1);
            var id = this.idlist.length;
            question = new Question(id, "This is your question?", [{ id: 1, text: "answer1" }, { id: 2, text: "answer 2" },{ id: 3, text: "answer 3" },{ id: 4, text: "answer 4" }]);
        }
        this.questions.push(question);
    },
    deleteQuestion: function (id) {
        for (var i = 0; i < this.questions.length; i++) {
            if (id == this.questions[i].id) {
                this.questions.splice(i, 1);
                break;
            }
        }
    },
    renderQuestions: function () {
        var htm;
        htm = "<div class='questions'>";
        for (var i = 0; i < this.questions.length; i++) {
            htm += this.questions[i].renderQuestion();
        }
        htm += "</div>";
        return htm;
    },
    updateQuestions: function () {
        for (var i = 0; i < this.questions.length; i++) {
            this.questions[i].updateQuestion();
            this.questions[i].updateOptions();
        }
    }
}


function updateHtml(){
    document.getElementById("questionsHtm").innerHTML = qlist.renderQuestions();
}

var qlist = new QuestionList();
qlist.addQuestion();
qlist.addQuestion();
updateHtml();


function createJson() {
    var qJson = {};
    addOtherTextFileds(qJson);
    qlist.updateQuestions();
    Object.assign(qJson, JSON.parse(JSON.stringify(qlist)));
    var checkedAns;
    var opsText;
    for (var i = 0; i < qJson.questions.length; i++) {
        var ops = qJson.questions[i].options;
        for (var j = 0; j < ops.length; j++) {
            opsText = ops[j].text.trim();
            if(opsText) {
                ops[j] = opsText;
            } else {
                 ops.splice(j,1);
            }
        }
        checkedAns=document.querySelectorAll("[name='option"+ qJson.questions[i].id +"']:checked");
        qJson.questions[i]["ans"] = (checkedAns && checkedAns.length >0) ? checkedAns[0].dataset["ansid"] : "-1";
    }
    
    document.getElementById('questJson').innerHTML = JSON.stringify(qJson, undefined, 2);
}

function addOtherTextFileds(obj){
    obj["id"] = document.getElementById("quizId").value;
}
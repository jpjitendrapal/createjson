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
        htm = "<fieldset><legend class='b bg-light-yellow'>Question " + this.id + ":</legend>" + 
            "<div data-id='" + this.id + "' class='question'>" +
            // "<div onclick='qlist.deleteQuestion(" + this.id + ");updateHtml();' data-qid='" + this.id +"' class='delete'>X</div>" +
            "<input class='q-text ba lh-copy' type='text' value='" + this.text + "'>" + this.renderOptions() +
            "</div></fieldset>";

        return htm;
    },
    renderOptions: function () {
        var htm;
        htm = "<div class='options'>";
        for (var i = 0; i < this.options.length; i++) {
            htm += "<div data-id='" + this.options[i].id + "' class='ans'>" +
                "<br><input data-ansid='" + this.options[i].id + "' type='radio' name='option" + this.id + "' />&nbsp;&nbsp;<input class='ans-text ba lh-copy' type='text' value='" + this.options[i].text + "'/></div>";
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
            if(ansnode.length > 0){
                this.options[i].text = ansnode[0].value;
            }
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
        if(qlist){
            qlist.updateQuestions();
        }
        if (question) {
            this.questions.push(question);
        } else {
            this.idlist.push(this.idlist.length+1);
            var id = this.idlist.length;
            question = new Question(id, "This is your question?", [{ id: 1, text: "answer 1" }, { id: 2, text: "answer 2" },{ id: 3, text: "answer 3" },{ id: 4, text: "answer 4" }]);
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
            ops[j] = opsText;
            
        }
        checkedAns=document.querySelectorAll("[name='option"+ qJson.questions[i].id +"']:checked");
        qJson.questions[i]["ans"] = (checkedAns && checkedAns.length >0) ? checkedAns[0].dataset["ansid"] : "-1";
    }
    
    document.getElementById('questJson').innerHTML = JSON.stringify(qJson, undefined, 2);
}

function copyJson() {
    if (navigator.clipboard) {
        var questTextArea = document.getElementById('questJson');
        if(questTextArea) {
            questTextArea.focus();
            questTextArea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
        }
    }
}

function addOtherTextFileds(obj){
    obj["id"] = document.getElementById("quizId").value;
    obj["landingPage"] = {};
    obj["landingPage"]["title"] = document.getElementById("landingPage_title").value;
    obj["landingPage"]["subTitle"] = document.getElementById("landingPage_subTitle").value;
    obj["landingPage"]["quizTitle"] = document.getElementById("landingPage_quizTitle").value;
    obj["landingPage"]["quizCompleteSubTitle"] = document.getElementById("landingPage_quizCompleteSubTitle").value;
    obj["successPage"] = {};
    obj["successPage"]["title"] = document.getElementById("successPage_title").value;
    obj["successPage"]["subTitle"] = document.getElementById("successPage_subTitle").value;
    obj["successPage"]["wonText"] = document.getElementById("successPage_wonText").value;
    obj["successPage"]["coupon"] = document.getElementById("successPage_coupon").value;
    obj["successPage"]["expText"] = document.getElementById("successPage_expText").value;
    obj["errorPage"] = {};
    obj["errorPage"]["title"] = document.getElementById("errorPage_title").value;
    obj["errorPage"]["subTitle"] = document.getElementById("errorPage_subTitle").value;
    obj["config"] = {};
    obj["config"]["nextQtime"] = parseInt(document.getElementById("nextQtime").value, 10);
    obj["config"]["wrongQtime"] = parseInt(document.getElementById("wrongQtime").value, 10);
}
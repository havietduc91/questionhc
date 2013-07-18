var questionArr = []; //FINAL result. This is what we need

$(document).ready(function() {

    $("#hcContent").change(function() {
        var text = $(this).val();
	   //parse HTML Dom
        $("#questionsDom").html(text);
        //end of parse

		//REMOVE QUESTION CONTROL
		$("#questionsDom").find("div.questions-controls").remove();
        
		//Loop questionsDom to find out the questions
	   $("#questionsDom div.question").each(function(i, e) {
            var $question = $(this);

            var qTextTranlate = $question.find("div.section-tips").find("div.tip-viet-mean div").html();
            var qHints = $question.find("div.section-tips").find("div.tip-do-how div").html();
			
            //TODO : regex to clean/format qText
            var options = [];
            var bol;           
            $question.find("div.section-answer").find('tr').each(function(i, e) {
                $tr = $(this);

                bol = $tr.hasClass('answer-right');

                var nameC = $tr.find('td:eq(1) label').html();

                //Replace () from nameC
				//Fomst nameChoice: remove white space , character in (....)
				nameC = nameC.replace(/^(\s)*\((\s)*[abcdABCD](\s)*\)(\s)*/, '');
				nameC = nameC.replace(/'/,"&#8217;");
				
				//Remove mean choice is "Không có nội dung cho mục này"
				$tr.find('td:eq(2)').find('div').remove();
	            meanC = $tr.find('td:eq(2)').html();
				
				var explainC = $tr.find('td:eq(3)').html();

                var choice = {
                    name: nameC,
                    mean: meanC,
                    explain: explainC,
                    isAnswer: bol
                };
                options.push(choice);
            });
	
            //Swap element has isAnswer is true and element first in array options
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].isAnswer == true && i > 0)
                {
                    choiceTemp = options[i];
                    options[i] = options[0];
                    options[0] = choiceTemp;
                    break;
                }
            }
			
            //Get text multiple choice [a,b,c,d]
            var qTextChoice = "[";
            for (var i = 0; i < options.length; i++)
            {
                if (i == options.length - 1) {
                    qTextChoice = qTextChoice + options[options.length - 1].name;
                    break;
                }
                qTextChoice = qTextChoice + options[i].name + ",";
            }
            qTextChoice = qTextChoice + "]";
           
		   
		   //Fomat Text Answer
            // Remove <b> tag number
            $question.find("div.section-ask").find("b.ask-num").remove();
			 //fill qtexchoice  to '<u></u>' and remove <u> tag 
			//processing with case in <u> tag has content 
			$question.find("div.section-ask").find('u').each(function(i,e){

                if ($(this).html().replace(/&nbsp;/g,'') === '') {
				     	console.log('text was all whitespace');
						$(this).after(qTextChoice).remove();	
						 // text was all whitespace
				} else {
						console.log('text has real content' + $(this).html().replace(/&nbsp;/g,''));
						 // text has real content, now free of leading/trailing whitespace
				}
				
		    });
            var qText = $question.find("div.section-ask").html();
            console.log(qText);
            //end of fill
			
            var question = {
                text: qText,
                hints: qHints,
                textTran: qTextTranlate,
                choices: options,
                qTextChoice: qTextChoice
        
            };
            questionArr.push(question);
        });

        //Display the questions data visually 
        $.each(questionArr, function(i, el) {
            var choiceV;
            var div = "<div class='question'><div>"
                    + el.text + "<br>"
                    + el.textTran + "<br>"
                    + el.hints + "<br>" + "</div>";

            //Dislay the choice data before add tag div
            $.each(el.choices, function(index, val) {
                choiceV = val.name + "<br>" + val.mean + "<br>" + val.explain + "<br>" + val.isAnswer + "<br>";
                div = div + choiceV;
            });

            div = div + '<br/>' + "</div>";

            $(div).insertAfter($("#questionsList"));
        });
        //TODO: post questionArr to server -> db
    });
});

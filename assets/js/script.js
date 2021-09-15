// Event text was clicked to be edited
$("#Timeblocks").on("click", "p.discription", function() {
    var textInput = $("<textarea>").addClass("col-10 discription form-control").val($(this).text().trim());

    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

// Event save button was clicked
const saveTimeBlock = function(tbDiscription) {

    //alert("save clicked: " + editArea);
    let target = $(tbDiscription).closest(".row").find(".discription");

    // get the current text from textarea
    let text = target.val().trim();

    //recreate p element
    let eventP = $("<p>").addClass('col-10 discription test').text(text);

    // replace textarea with p element
    target.replaceWith(eventP);
}


// Event text being edited lost focus
$("#Timeblocks").on("blur", "textarea", function() {

    // get the parent time-block's id attribute
    var tbId = $(this).closest(".time-block").attr("id").replace("tb-", "");

    //if related.target is saveBtn with same parent id then save else restore old text
    if (event.relatedTarget && event.relatedTarget.matches(".saveBtn") &&
        $(event.relatedTarget).closest(".time-block").attr("id").replace("tb-", "") === tbId) {
        saveTimeBlock(this);
    } else {

        // get the text areas current value 
        //var text = $(this).val().trim();

        // get the task's position in the list of the other li elements
        //var index = $(this).closest(".time-block").index();

        // tasks[status][index].text = text;
        //saveTasks();

        //recreate p element
        var eventP = $("<p>").addClass('col-10 discription').text("Event Goes Here");

        // replace textarea with p element
        $(this).replaceWith(eventP);
    }
});


const printTimeblocks = function() {
    let dayStart = 7; //7am
    let dayEnd = 20; //8pm

    for (let i = dayStart; i <= dayEnd; i++) {

        // container
        let tb = $("<div>").attr("id", 'tb-' + i).addClass('col-12 time-block');
        //time of day
        let tbTime = $("<div>").attr("id", 'tb-time').addClass('col-1 hour').text(i);
        //event
        let tbEvent = $("<p>").attr("id", 'tb-event').addClass('col-10 discription').text("EVENT HERE");
        // save icon
        let tbSave = $("<button>").attr("id", 'tb-save').addClass('col-1 saveBtn').text("SAVE");

        //compile all elements
        tb.append($("<div>").addClass('row').append(tbTime, tbEvent, tbSave));

        //add to timeblocklist
        $("#Timeblocks").append(tb);
    }

}

printTimeblocks();
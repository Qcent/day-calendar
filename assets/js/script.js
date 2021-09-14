const printTimeblocks = function() {
    let dayStart = 7; //7am
    let dayEnd = 20; //8pm

    for (let i = dayStart; i <= dayEnd; i++) {

        // container
        let tb = $("<div>").attr("id", 'tb-' + i).addClass('col-12');
        //time of day
        let tbTime = $("<div>").attr("id", 'tb-time').addClass('col-1 hour').text(i);
        //event
        let tbEvent = $("<div>").attr("id", 'tb-event').addClass('col-10 discription').text("EVENT HERE");
        // save icon
        let tbSave = $("<div>").attr("id", 'tb-save').addClass('col-1 saveBtn').text("SAVE");

        //compile all elements
        tb.append($("<div>").addClass('row').append(tbTime, tbEvent, tbSave));

        //add to timeblocklist
        $("#Timeblocks").append(tb);
    }

}

printTimeblocks();
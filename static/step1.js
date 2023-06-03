var bags;

$(document).ready(function () {
    search_rosbag();
});

search_rosbag = function(){
    $.get("/api/search_bags",
        function (data) {
            console.log(data)
            bags = data;
            for(i=0;i<bags.length;i++){
                rosbag_searched(i,bags[i].bag_name,bags[i].bag_size,bags[i].bag_folder);
            }
        },
        "json"
    );
}

rosbag_searched = function(bag_index,bag_name,bag_size,bag_folder){
    $("#step1-rosbag-list").append(`<div class="list-group-item list-group-item-action step1-rosbag" id="step1-rosbag-${bag_index}">
        <a href="javascript:analyze_rosbag(${bag_index})" class="stretched-link"></a>
        <div class="row align-items-center">
            <div class="col-10">
                ${bag_name}
                <div class="small">${humanFormat.bytes(bag_size)}</div>
                <div class="small">${bag_folder}</div>
            </div>
            <div class="col-2 spinner-border text-light d-none"></div>
        </div>
    </div>`);
}

analyze_rosbag = function(bag_index){
    $("#step1-rosbag-"+bag_index).addClass("active")
    $("#step1-rosbag-"+bag_index+" .spinner-border").removeClass("d-none");
}
var bags;
var topics = [];
var temp;

$(document).ready(function () {
    search_rosbag();
});

search_rosbag = function(){
    $.get("/api/search_bags",
        function (data) {
            $("#step1-rosbag-list").empty();
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
        <a href="javascript:choose_rosbag(${bag_index})" class="stretched-link"></a>
        <div class="row align-items-center">
            <div class="col-10">
                ${bag_name}
                <div class="small">${humanFormat.bytes(bag_size)}</div>
                <div class="small">${bag_folder}</div>
            </div>
            <div class="col-2 spinner-border text-light d-none"></div>
        </div>
    </div>`);
    refresh_bag_count();
}

choose_rosbag = function(bag_index){
    if($("#step1-rosbag-"+bag_index).hasClass("active")){
        $("#step1-rosbag-"+bag_index).removeClass("active")
        topics = topics.filter(function(item) {
            return item.bag_index != bag_index;
        });
        refresh_topics_list();
        return
    }
    
    $("#step1-rosbag-"+bag_index).addClass("active")
    $("#step1-rosbag-"+bag_index+" .spinner-border").removeClass("d-none");
    refresh_bag_count();

    $.post("/api/analyze_bag",
        {
            "index":bag_index,
            "filefolder":bags[bag_index].bag_folder,
            "filename":bags[bag_index].bag_name,
        },
        function (data){
            $("#step1-rosbag-"+bag_index+" .spinner-border").addClass("d-none");

            if(data.length == 0) return
            
            // delete old ones
            topics = topics.filter(function(item) {
                return item.bag_index != data[0].bag_index;
            });
            // add new ones
            topics = topics.concat(data)

            refresh_topics_list();
        },
    "json")
}

refresh_topics_list = function(){
    $(`.step1-topic-list`).empty();
    topics.forEach(function(item){
        $(`#step1-${item.sensor_type}-list`).append(`<div class="list-group-item list-group-item-action step1-${item.sensor_type}" id="step1-sensor-${item.bag_index}-${item.topic_index}" data-bag-index="${item.bag_index}" data-topic-index="${item.topic_index}">
        <a href="javascript:choose_topic(${item.bag_index},${item.topic_index})" class="stretched-link"></a>
        <div class="row align-items-center">
        <div class="col-12">
        ${item.topic}
        <div class="small">${item.msgtype}</div>
        <div class="small">${bags[item.bag_index].bag_folder}/${bags[item.bag_index].bag_name}</div>
        </div>`);
    });
    refresh_sensor_count();
}

choose_topic = function(bag_index,topic_index){
    if($(`#step1-sensor-${bag_index}-${topic_index}`).hasClass("active")){
        $(`#step1-sensor-${bag_index}-${topic_index}`).removeClass("active")
    }else{
        $(`#step1-sensor-${bag_index}-${topic_index}`).addClass("active")
    }
    refresh_sensor_count();
}

refresh_bag_count = function(){
    $(".step1-bag-count").empty()
    $(".step1-bag-count").append(`<span class="card-text"># of ROS bags selected: ${$(".step1-rosbag.active").length}/${bags.length}</span>`)
}

refresh_sensor_count = function(){
    $(".step1-camera-count").empty()
    $(".step1-camera-count").append(`<span class="card-text"># of camera topics selected: ${$(".step1-camera.active").length}/${$(".step1-camera").length}</span>`)

    $(".step1-lidar-count").empty()
    $(".step1-lidar-count").append(`<span class="card-text"># of LiDAR topics selected: ${$(".step1-lidar.active").length}/${$(".step1-lidar").length}</span>`)

    $(".step1-imu-count").empty()
    $(".step1-imu-count").append(`<span class="card-text"># of IMU topics selected: ${$(".step1-imu.active").length}/${$(".step1-imu").length}</span>`)
}
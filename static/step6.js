var running = false;
const term = new Terminal();
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

$(document).ready(function () {
    term.open(document.getElementById('terminal'));
})

document.getElementById('multical_carousel').addEventListener('slide.bs.carousel', event => {
    if(event.to==5){
        setTimeout(() => {
            fitAddon.fit()
        }, 500);

    if(!running){
        generate_calibration_task()
    }
    }
})

generate_calibration_task = function(){
    running=true

    target = {
        target_type: 'aprilgrid',
        numberTargets: $("#target-number").val(),
        tagCols: $("#target-col").val(),
        tagRows: $("#target-row").val(),
        tagSize: $("#target-size").val(),
        tagSpacing: $("#target-space").val()
    }

    imus = {}
    for(i=0;i<$(".step1-imu.active").length;i++){
        bi=$(".step1-imu.active")[i].getAttribute("data-bag-index")
        ti=$(".step1-imu.active")[i].getAttribute("data-topic-index")
        item = topics.filter(function(topic) {
            return topic.bag_index == bi && topic.topic_index == ti;
        })[0]
        
        imu = {
            accelerometer_noise_density:    $(`#imu-${bi}-${ti}-and`).val(),
            accelerometer_random_walk:      $(`#imu-${bi}-${ti}-arw`).val(),
            
            gyroscope_noise_density:        $(`#imu-${bi}-${ti}-gnd`).val(),
            gyroscope_random_walk:          $(`#imu-${bi}-${ti}-grw`).val(),
            
            rosbag:                         bags[bi].bag_folder+"/"+bags[bi].bag_name,
            rostopic:                       item.topic,
            update_rate:                    $(`#imu-${bi}-${ti}-rate`).val(),
            model:                          "calibrated",
        }

        imus[`imu${i}`] = imu
    }

    lidars = {}
    for(i=0;i<$(".step1-lidar.active").length;i++){
        bi=$(".step1-lidar.active")[i].getAttribute("data-bag-index")
        ti=$(".step1-lidar.active")[i].getAttribute("data-topic-index")
        item = topics.filter(function(topic) {
            return topic.bag_index == bi && topic.topic_index == ti;
        })[0]
        
        lidar = {
            rosbag:                    bags[bi].bag_folder+"/"+bags[bi].bag_name,
            rostopic:                  item.topic,

            relative_point_timestamp:  $(`#lidar-${bi}-${ti}-rt-true:checked`).val()=="on",
            reserved_points_per_frame: $(`#lidar-${bi}-${ti}-rp`).val(),
        }

        lidars[`lidar${i}`] = lidar
    }

    cameras = {}
    for(i=0;i<$(".step1-camera.active").length;i++){
        bi=$(".step1-camera.active")[i].getAttribute("data-bag-index")
        ti=$(".step1-camera.active")[i].getAttribute("data-topic-index")
        item = topics.filter(function(topic) {
            return topic.bag_index == bi && topic.topic_index == ti;
        })[0]
        
        camera = {
            camera_model:       $(`#camera-${bi}-${ti}-camera-model-pinhole:checked`).val() ? "pinhole" : "",
            distortion_coeffs:  [
                                    $(`#camera-${bi}-${ti}-distortion-1`).val(),
                                    $(`#camera-${bi}-${ti}-distortion-2`).val(),
                                    $(`#camera-${bi}-${ti}-distortion-3`).val(),
                                    $(`#camera-${bi}-${ti}-distortion-4`).val(),
                                ],
            distortion_model:   $(`#camera-${bi}-${ti}-distortion-model-radtan:checked`).val() ? "radtan" : 
                                $(`#camera-${bi}-${ti}-distortion-model-equidistant:checked`).val() ? "equidistant" : "",
            intrinsics:         [
                                    $(`#camera-${bi}-${ti}-fu`).val(),
                                    $(`#camera-${bi}-${ti}-fv`).val(),
                                    $(`#camera-${bi}-${ti}-pu`).val(),
                                    $(`#camera-${bi}-${ti}-pv`).val(),
                                ],
            resolution:         [
                                    $(`#camera-${bi}-${ti}-width`).val(),
                                    $(`#camera-${bi}-${ti}-height`).val(),
                                ],
            rosbag:             bags[bi].bag_folder+"/"+bags[bi].bag_name,
            rostopic:           item.topic,
        }

        cameras[`cam${i}`] = camera
    }

    task = {
        target:target,
        cameras:cameras,
        lidars:lidars,
        imus:imus,
    }

    task_info = task;

    $.post("/api/start_task",  {data:JSON.stringify(task)},
        function (data) {
            task_no = data.task_no;
            interval_handle = setInterval(update_progress, 1000);
        },
        "json"
    );
}

var task_no = "";
var offset = 0;
var request_num_max = 3;
var task_info = {};
var interval_handle = null;

update_progress = function(){
    offset_cache = offset
    fitAddon.fit()

    if(request_num_max>0){
        request_num_max--;
        $.ajax({
            method: "GET",
            url: `/api/fetch_output/${task_no}/${offset_cache}`,
            dataType: "json",
            timeout: 10000,
            })
            .done(function( data ) {
                if(offset!=offset_cache){
                    console.log("response too old, ignore")
                    return
                } 
                term.write(data.output.replace(/\n/g,"\r\n"));
                offset = data.end;

                if(data.output.index_of("PlotCollection.py")>=0){
                    console.log("x11 window need to be closed")
                    // x11 window need to be closed
                }

                if(data.output.index_of("Report written to")>=0){
                    console.log("calibration succeeded")
                    bootstrap.Modal($("#calibration-done-modal")).show()
                    $("#data-folder").innerHTML=task_no
                }
            })
            .always(function() {
                request_num_max++;
        });
    }
}
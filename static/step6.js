var running = false;
const term = new Terminal();
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

$(document).ready(function () {
    term.open(document.getElementById('terminal'));
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
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
            
            rosbag:                         bags[bi].bag_folder+bags[bi].bag_name,
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
            rosbag:                    bags[bi].bag_folder+bags[bi].bag_name,
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
                                $(`#camera-${bi}-${ti}-distortion-model-equi:checked`).val() ? "equi" : "",
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
            rosbag:             bags[bi].bag_folder+bags[bi].bag_name,
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

    console.log(task)

    $.post("/api/start_task",  {data:JSON.stringify(task)})
}
async function CreatePath(start, end){
    //var request = new XMLHttpRequest();
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248b9b63c9a19ca44399c5305f36f6e3340&start='+start+'&end='+end);
    var data = await res.json();
    return data;
}




class StartEndPoints{
    start_point = '';
    end_point = '';
    id = 0;
    flag = false;
    
    GetPoint(){
        if(!flag){
            return start_point;
        }
        return end_point;
    }
    
    constructor(start = '', end = '', id){
        this.start_point = start;
        this.end_point = end;
        this.id = id;
    }
}

class ClassRouteOptimizer{

    constructor(points){
        this.main_route = points;
        console.log(
            parseFloat(points.start_point.split(',')[0]),
            parseFloat(points.start_point.split(',')[1])
        );
        map.on('load', function () {
            // Add a layer showing the state polygons.
            map.addLayer({
                'id': Math.round(Math.random()*1000).toString(),
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": [
                          {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "coordinates": [
                                parseFloat(points.start_point.split(',')[0]),
                                parseFloat(points.start_point.split(',')[1])
                              ],
                              "type": "Point"
                            }
                          }
                        ]
                      }
                },                         
            });
            map.addLayer({
                'id': Math.round(Math.random()*1000).toString(),
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": [
                          {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "coordinates": [
                                parseFloat(points.end_point.split(',')[0]),
                                parseFloat(points.end_point.split(',')[1])
                              ],
                              "type": "Point"
                            }
                          }
                        ]
                      }
                },                         
            });
        });
    }   

    
    routes = []
    add_route(points){
        var geojson = parseFloat(points.start_point.split(',')[0]) + ', ' + parseFloat(points.start_point.split(',')[1]);
        console.log(geojson);
        var a = 129.72230503617828;
        var b = 62.01998669774943;
        this.routes.push(points);
        map.on('load', function () {
            // Add a layer showing the state polygons.
            map.addLayer({
                'id': Math.round(Math.random()*1000).toString(),
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": [
                          {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "coordinates": [
                                parseFloat(points.start_point.split(',')[0]),
                                parseFloat(points.start_point.split(',')[1])
                              ],
                              "type": "Point"
                            }
                          }
                        ]
                      }
                },                         
            });
            map.addLayer({
                'id': Math.round(Math.random()*1000).toString(),
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        "type": "FeatureCollection",
                        "features": [
                          {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "coordinates": [
                                parseFloat(points.end_point.split(',')[0]),
                                parseFloat(points.end_point.split(',')[1])
                              ],
                              "type": "Point"
                            }
                          }
                        ]
                      }
                },                         
            });
        });
    }   

    build_optimize_route(){
        
        var my_route = 'a'

        function arrayRemove(arr, value) {
            console.log(arr, value);
            var array = [];
            arr.forEach(element => {
                if(value != element){
                    array.push(element);
                }
            });  
            return array;
        }

        function copy_array_of_object(post_array){
            var new_array = [];
            post_array.forEach(element => {
                    new_array.push(Object.assign({},element));
                });
            return new_array;
        }

        function count_same_object(array){
            var iter = 0;
            var count_same_item = 0;
            
            while(iter != array.length-1){
                var local_count = 0;
                for(var i = 0; i < array.length; i++){
                    if(iter != i){
                        if(array[i].id == array[iter].id){
                            local_count++;
                        }
                    }
                }
                if(local_count > count_same_item){
                    count_same_item = local_count;
                }
                iter++;
            }
            
            return count_same_item;
        }

        function delete_worst_route(d2_array){
            console.log(d2_array);
            var local_array = [];
            
            for(var i = 0; i < d2_array.length; i++){
                if(count_same_object(all_array[i]) < 2){
                    local_array.push(d2_array[i]);
                }
            }
            
            return local_array;
        }

        var all_array = [];

        function search_deep(my_route, local_routes, deep, max, heigth){                 
            console.log(my_route);
            var local = copy_array_of_object(local_routes);

            if(heigth == 2){
                let a = (Object.assign({},local_routes[0]));
                let b = (Object.assign({},local_routes[0]));
                a.flag = false;
                b.flag = true;
                my_route.push(a);
                my_route.push(b);
                all_array.push(my_route);
                return;
            }

            if(my_route.length == heigth){
                console.log(my_route);
                all_array.push(my_route);
                
                //console.log(count_same_object(my_route))
            }
            
            for(var i = 0; i < local.length; i++){         
                if(deep == max){
                    return;
                }
                var new_array = copy_array_of_object(my_route);
                var point = Object.assign({},local_routes[i]);
                new_array.push(point);
                search_deep(new_array, local, deep+1, max, heigth);
            }

        }
        
        function install_flag(d2_array){
            console.log(d2_array);
            for(var i = 0; i < d2_array.length; i++){
                for(var j = 0; j < d2_array[i].length; j++){
                    var local_id = -1;
                    if(d2_array[i][j].flag == false){
                        local_id = d2_array[i][j].id;
                        var iter = j+1;
                        while(iter < d2_array[i].length){
                            if(local_id == d2_array[i][iter].id){
                                d2_array[i][iter].flag = true;
                                break;
                            }
                            iter++;
                        }
                    }
                }
            }
            return d2_array;
        }

        var array_path = []
        array_path.push(this.main_route);
        search_deep([], this.routes, 0, this.routes.length*this.routes.length, this.routes.length * 2);
        
        function GetPoint(obj){
            console.log(obj);
            if(!obj.flag){
                return obj.start_point;
            }
            return obj.end_point;
        }
        
        function find_minimal_path(points, d2_array){
            var min = 999999999999999999;
            
            var path = [];
            console.log(d2_array.length);
            d2_array.forEach(async element=>{
                var route = [];
                var local_path = [points.start_point];
                
                let el = await (CreatePath(points.start_point, GetPoint(element[0])));
                
                local_min = el.features[0].properties.summary.distance;
                

                el = await CreatePath( GetPoint(element[element.length-1]), points.start_point);
                

                
                local_min += el.features[0].properties.summary.distance;
                console.log(element);
                for(var i = 0; i < element.length; i++){
                    
                    local_path.push(GetPoint(element[i]));

                    local_min += el.features[0].properties.summary.distance;
                }
                local_path.push(points.end_point);
                var local_min = 0;
                for(var i = 1; i < local_path.length; i++){
                    
                    
                    el = await CreatePath(local_path[i-1], local_path[i]);
                    
                    local_min += el.features[0].properties.summary.distance;
                    el.features[0].geometry.coordinates.concat(el.features[0].geometry.coordinates).forEach(elem => {
                        route.push(elem);
                    })
                }

                // if(element == d2_array[d2_array.length-1]){
                //     console.log("Начало");
                //     await map.on('load', async function () {
                //             // Add a layer showing the state polygons.
                //             map.addLayer({
                //                 'type': 'Feature',
                //                 'source': {
                //                     'type': 'geojson',
                //                     'data': {
                //                         "type": "FeatureCollection",
                //                         "features": [
                //                             {
                //                                 "type": "Feature",
                //                                 "properties": {},
                //                                 "geometry": {
                //                                     "coordinates": [
                //                                         route
                //                                     ],
                //                                     "type": "LineString"
                //                                 }
                //                             }
                //                         ]
                //                     }
                //                 },
                //             });
                //         });
                //     console.log("Конец");
                
                // }

                if(min > local_min) {
                    min =  local_min;
                    console.log("Минимальное растояние",min);
                    console.log("Путь",route);
                    path = route.slice();
                }
                
                
            })    
            
            console.log(path);
        }
        

        find_minimal_path(this.main_route, install_flag(delete_worst_route(all_array)));

        
    }
}

var opt = new ClassRouteOptimizer(new StartEndPoints('129.68643665313724,61.99433610469318','129.7394371032715,62.03084847918489',1));
//opt.add_route(new StartEndPoints('129.72772121429446,62.01975640949452','129.71042633056643,62.03139190682737',2))
opt.add_route(new StartEndPoints('129.72179889678958,62.023501189952555','129.7116279602051,62.01697772625459',3));
//opt.add_route(new StartEndPoints('d','D',4));
opt.build_optimize_route();

//console.log(CreatePath('129.72772121429446,62.01975640949452','129.71042633056643,62.03139190682737'));


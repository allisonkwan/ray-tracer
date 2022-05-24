// create the drawing canvas
function setup() {
  createCanvas(500, 500, P2D);
  reset_scene();
  two_short_cylinders();
}

// try out the different scenes
function keyPressed() {
  console.log("key pressed\n");
  reset_scene();
  switch (key) {
    case '1': two_short_cylinders(); break;
    case '2': five_cylinders(); break;
    case '3': cylinder_face(); break;
    case '4': one_sphere(); break;
    case '5': three_spheres(); break;
    case '6': two_spheres(); break;
    case '7': colored_lights(); break;
    case '8': sphere_reflections(); break;
  }
}

// two cylinders, to test the end caps
function two_short_cylinders() {

  console.log("start of two_short_cylinders\n");

  set_background(0.5, 0.5, 0.9);

  set_fov(60.0);
  new_light(1, 1, 1, 2, 0, -2);

  // one cylinder
  new_material(1, 0.0, 0.0, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0, -1.5, -4, 1, 0.7);

  new_material(0.0, 1, 0.0, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0, 0.8, -4, 1, 0.7);

  draw_scene();

  console.log("end of two_short_cylinders\n");
}

// five cylinders in a pattern
function five_cylinders() {

  console.log("start of five_cylinders\n");

  set_background(0.95, 0.95, 0.95);

  set_fov(60.0);

  new_light(1, 1, 1, 7, 7, 10);

  // cylinders
  let rad = 0.5;
  let h = 0.2;

  new_material(0.0, 0.0, 0.9, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(-1.1, -1.4, -4, rad, h);

  new_material(0.1, 0.1, 0.1, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0, -1.4, -4, rad, h);

  new_material(0.9, 0.0, 0.0, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(1.1, -1.4, -4, rad, h);

  new_material(0.9, 0.9, 0.0, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(-0.55, -1.5, -3.5, rad, h);

  new_material(0.0, 0.9, 0.0, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0.55, -1.5, -3.5, rad, h);

  draw_scene();

  console.log("end of five_cylinders\n");
}

// cylinders that make a face
function cylinder_face() {

  console.log("start of cylinder_face\n");

  set_background(0.95, 0.95, 0.95);

  set_fov(60.0);

  new_light(1, 1, 1, 7, 7, 10);

  // cylinders

  new_material(0.7, 0.7, 0.9, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0, -1, -4, 1, 2);

  new_material(0.4, 0.4, 0.9, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0, -0.2, -3, 0.2, 0.4);

  new_material(0.4, 0.9, 0.4, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(-0.3, 0.3, -3, 0.15, 0.25);

  new_material(0.4, 0.9, 0.4, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0.3, 0.3, -3, 0.15, 0.25);

  new_material(0.9, 0.4, 0.6, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0, -0.6, -3, 0.6, 0.2);

  draw_scene();

  console.log("end of cylinder_face\n");
}

// one sphere
function one_sphere() {

  console.log("start of one_sphere\n");

  set_background(0.5, 0.5, 0.9);

  set_fov(60.0);
  new_light(1, 1, 1, 7, 6, 10);

  // one sphere
  new_material(0.3, 0.8, 0.3, 0, 0, 0, 0, 0, 0, 1, 0);
  new_sphere(0, 0, -4, 1);

  draw_scene();

  console.log("end of one_sphere\n");
}

// three spheres, various shading
function three_spheres() {

  console.log("start of three_spheres\n");

  set_background(0.5, 0.5, 0.9);

  set_fov(60.0);
  new_light(1, 1, 1, 5, 3, 5);
  ambient_light(0.5, 0.5, 0.5);

  // four spheres
  new_material(0.7, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0);
  new_sphere(-1, 1, -4, 0.9);

  new_material(0.6, 0, 0, 0.8, 0.8, 0.8, 0, 0, 0, 1, 0);
  new_sphere(1, 1, -4, 0.9);

  new_material(0.6, 0, 0, 0.8, 0.8, 0.8, 0.7, 0.7, 0.7, 20, 0);
  new_sphere(0, -1, -4, 0.9);

  draw_scene();

  console.log("end of three_spheres\n");
}

// two spheres, testing reflection
function two_spheres() {

  console.log("start of two_spheres\n");

  set_background(0, 0, 0);

  set_fov(60.0);
  new_light(1, 1, 1, -5, 2, 5);

  // two spheres
  new_material(0.7, 0, 0, 0, 0, 0, 0.7, 0.7, 0.7, 20, 0.7);
  new_sphere(0, 0, -4, 1);

  new_material(0.2, 0.8, 0.2, 0, 0, 0, 0, 0, 0, 1, 0);
  new_sphere(1, 0.6, -3, 0.3);

  draw_scene();

  console.log("end of two_spheres\n");
}

// one sphere lit by multiple colored lights, floating above a cylinder's top
function colored_lights() {

  console.log("start of colored_lights\n");

  set_background(0.5, 0.5, 0.9);

  set_fov(60.0);

  new_light(0.8, 0.2, 0.2, 3, 4, 0);
  new_light(0.2, 0.8, 0.2, -3, 4, 0);
  new_light(0.2, 0.2, 0.8, 0, 4, -5);

  ambient_light(0.2, 0.2, 0.2);

  new_material(0.8, 0.8, 0.8, 0, 0, 0, 0, 0, 0, 1, 0);
  new_sphere(0, 0.5, -3, 1);

  new_cylinder(0, -1, 0, 7, 0.2);

  draw_scene();

  console.log("end of colored_lights\n");
}

// reflections in mirror spheres
function sphere_reflections() {

  console.log("start of sphere_reflections\n");

  set_background(0.5, 0.5, 0.9);

  set_fov(60.0);

  new_light(1, 1, 1, 1, 4, 3);
  ambient_light(0.2, 0.2, 0.2);

  // cylinder that acts as a ground plane
  new_material(0.8, 0.8, 0.8, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(0, -1.2, 0, 20, 0.2);

  // reflective spheres on the left
  new_material(0.2, 0.2, 0.2, 0, 0, 0, 0.5, 0.5, 0.5, 30, 0.9);
  new_sphere(-1, 0, -8, 1);
  new_sphere(-1.5, 0, -6, 1);
  new_sphere(-2, 0, -4, 1);

  // colorful cylinders on the right
  new_material(0.8, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(1, -1, -8, 0.5, 2);

  new_material(0.2, 0.8, 0.2, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(2, -1, -6.5, 0.5, 2);

  new_material(0.2, 0.2, 0.8, 0, 0, 0, 0, 0, 0, 1, 0);
  new_cylinder(2.5, -1, -4.5, 0.5, 2);

  draw_scene();

  console.log("end of sphere_reflections\n");
}

// unused draw function
function draw() {
}

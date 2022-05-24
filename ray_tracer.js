var cylinderList = [];
var sphereList = [];
var lightList = [];
var currentMaterial = null;
var fov = null;
var background = null;
var n = null;
var l = null;
var intersection = null;
var intersectionSphere = null;
var c_r = null;
var c_l = null;
var c_p = null;
var ambientLight = [0, 0, 0];
var sphereIsCloser = null;

function reset_scene() {
  cylinderList = [];
  sphereList = [];
  lightList = [];
  currentMaterial = null;
  fov = null;
  background = null;
  n = null;
  l = null;
  intersection = null;
  intersectionSphere = null;
  c_r = null;
  c_l = null;
  c_p = null;
  ambientLight = [0, 0, 0];
  sphereIsCloser = null;
}

class ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }
}

class cylinder {
  constructor(x, y, z, radius, h, material) {
    this.pos = createVector(x, y, z);
    this.radius = radius;
    this.h = h;
    this.material = material;
  }
}

class sphere {
  constructor(x, y, z, radius, material) {
    this.pos = createVector(x, y, z);
    this.radius = radius;
    this.material = material;
  }
}

class surface {
  constructor(dr, dg, db, ar, ag, ab, sr, sg, sb, pow, k_refl) {
    this.dr = dr;
    this.dg = dg;
    this.db = db;
    this.ar = ar;
    this.ag = ag;
    this.ab = ab;
    this.sr = sr;
    this.sg = sg;
    this.sb = sb;
    this.pow = pow;
    this.k_refl = k_refl;
  }
}

class light {
  constructor(r, g, b, x, y, z) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

function set_background(r, g, b) {
  background = [r, g, b];
}

function set_fov(angle) {
  fov = angle;
}

function new_light(r, g, b, x, y, z) {
  let newLight = new light(r, g, b, x, y, z);
  lightList.push(newLight);
}

function new_material(dr, dg, db, ar, ag, ab, sr, sg, sb, pow, k_refl) {
  let s = new surface(dr, dg, db, ar, ag, ab, sr, sg, sb, pow, k_refl);
  currentMaterial = s;
}

function new_cylinder(x, y, z, radius, h) {
  let new_cylinder = new cylinder(x, y, z, radius, h, currentMaterial);
  cylinderList.push(new_cylinder);
}

function new_sphere(x, y, z, radius) {
  let new_sphere = new sphere(x, y, z, radius, currentMaterial);
  sphereList.push(new_sphere);
}

function ambient_light(r, g, b) {
  ambientLight = [r, g, b];
}

function hit(ray) {
  let rayOrigin = ray.origin;
  let rayDirection = ray.direction;
  let smallestT = null;
  let tempT = null;
  let closestCylinder = null;
  let x0 = rayOrigin.x;
  let y0 = rayOrigin.y;
  let z0 = rayOrigin.z;
  let surfaceNormalCyl = null;

  for (let i = 0; i < cylinderList.length; i++) {
    let radius = cylinderList[i].radius;
    let center = cylinderList[i].pos;
    let h = cylinderList[i].h;
    let viableTimes = [];

    // cylinder equation
    let a = sq(rayDirection.x) + sq(rayDirection.z);
    let b = 2 * (x0 * rayDirection.x - center.x * rayDirection.x + z0 * rayDirection.z - center.z * rayDirection.z);
    let c = sq(x0) + sq(center.x) - 2 * center.x * x0 + sq(z0) + sq(center.z) - 2 * center.z * z0 - sq(radius);

    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      tempT = null;
    } else {
      let tPlus = (-1 * b + sqrt(discriminant)) / (2 * a);
      let tMinus = (-1 * b - sqrt(discriminant)) / (2 * a);

      // check if intersection falls between [y, y+height] of cylinder
      let yPlus = y0 + tPlus * rayDirection.y;
      let yMinus = y0 + tMinus * rayDirection.y;

      // both times fall in the range; choose smaller time
      if (yPlus >= center.y && yPlus <= (center.y + h) && yMinus >= center.y && yMinus <= (center.y + h)) {
        if (tPlus > tMinus && tMinus > 0) {
          viableTimes.push(tMinus);
        } else if (tPlus > 0) {
          viableTimes.push(tPlus);
        }
      } else if (yPlus >= center.y && yPlus <= (center.y + h) && tPlus > 0) { // only 1 time falls in the range
        viableTimes.push(tPlus);
      } else if (yMinus >= center.y && yMinus <= (center.y + h) && tMinus > 0) {
        viableTimes.push(tMinus);
      }

      // check if it intersects cylinder end caps
      let t3 = (center.y - y0) / rayDirection.y; // time when ray intersects bottom cap (the plane y = center.y)
      let t4 = (center.y + h - y0) / rayDirection.y; // time when ray intersects top cap (the plane y = center.y + h)

      let posT3 = createVector(x0 + t3 * rayDirection.x, y0 + t3 * rayDirection.y, z0 + t3 * rayDirection.z);
      let posT4 = createVector(x0 + t4 * rayDirection.x, y0 + t4 * rayDirection.y, z0 + t4 * rayDirection.z);

      // check if position falls within the equation of end cap: x^2 + z^2 = r^2
      if (t3 > 0 && (pow(center.x - posT3.x, 2) + pow(center.z - posT3.z, 2) <= (radius * radius))) {
        viableTimes.push(t3);
      }
      if (t4 > 0 && (pow(center.x - posT4.x, 2) + pow(center.z - posT4.z, 2) <= (radius * radius))) {
        viableTimes.push(t4);
      }

      if (viableTimes.length > 0) {
        tempT = Math.min(...viableTimes); // min value of all viable times
        if (tempT > 0 && (tempT < smallestT || smallestT == null)) {
          smallestT = tempT;
          closestCylinder = cylinderList[i];
          intersection = createVector(x0 + smallestT * rayDirection.x, y0 + smallestT * rayDirection.y, z0 + smallestT * rayDirection.z);
          if (smallestT == t3) { // bottom cap
            surfaceNormalCyl = createVector(0, -1, 0); // surface normal points down
          } else if (smallestT == t4) { // top cap
            surfaceNormalCyl = createVector(0, 1, 0); // surface normal points up
          } else if (smallestT == tMinus || smallestT == tPlus) { // side of cylinder
            surfaceNormalCyl = createVector(intersection.x - closestCylinder.pos.x, 0, intersection.z - closestCylinder.pos.z); // oriented on y-axis so normal_y = 0
          }
        }
      }
    }
  }
  return [smallestT, closestCylinder, surfaceNormalCyl, ray, intersection, false];
}

function sphereHit(ray) {
  let rayOrigin = ray.origin;
  let rayDirection = ray.direction;
  let smallestT = null;
  let tempT = null;
  let closestSphere = null;
  let x0 = rayOrigin.x;
  let y0 = rayOrigin.y;
  let z0 = rayOrigin.z;
  let surfaceNormalSphere = null;

  for (let i = 0; i < sphereList.length; i++) {
    let radius = sphereList[i].radius;
    let center = sphereList[i].pos;

    // implicit sphere equation
    let a = sq(rayDirection.x) + sq(rayDirection.y) + sq(rayDirection.z);
    let b = -2 * (rayDirection.x * center.x + rayDirection.y * center.y + rayDirection.z * center.z - x0 * rayDirection.x - y0 * rayDirection.y - z0 * rayDirection.z);
    let c = sq(x0) - (2 * x0 * center.x) + sq(center.x) + sq(y0) - (2 * y0 * center.y) + sq(center.y) + sq(z0) - (2 * z0 * center.z) + sq(center.z) - sq(radius);

    let discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      tempT = null;
    } else {
      var t1 = (-1 * b + sqrt(discriminant)) / (2 * a);
      var t2 = (-1 * b - sqrt(discriminant)) / (2 * a);

      if (min(t1, t2) > 0) {
        tempT = min(t1, t2);
      } else if (max(t1, t2) > 0) {
        tempT = max(t1, t2);
      } else {
        tempT = null;
      }

      // compare tempT with smallestT
      if (tempT > 0 && (tempT < smallestT || smallestT == null)) {
        smallestT = tempT;
        intersectionSphere = createVector(x0 + smallestT * rayDirection.x, y0 + smallestT * rayDirection.y, z0 + smallestT * rayDirection.z);
        closestSphere = sphereList[i];
        surfaceNormalSphere = createVector(intersectionSphere.x - closestSphere.pos.x, intersectionSphere.y - closestSphere.pos.y, intersectionSphere.z - closestSphere.pos.z);
      }
    }
  }
  return [smallestT, closestSphere, surfaceNormalSphere, ray, intersectionSphere, true];
}

function closestHit(ray) {
  let cylinderHit = hit(ray);
  let sphereHitActual = sphereHit(ray);
  if (cylinderHit[0] == null && sphereHitActual[0] != null) {
    return sphereHitActual;
  } else if (sphereHitActual[0] == null && cylinderHit[0] != null) {
    return cylinderHit;
  } else if (cylinderHit[0] < sphereHitActual[0]) {
    return cylinderHit;
  } else if (sphereHitActual[0] < cylinderHit[0]) {
    return sphereHitActual;
  } else {
    return [null, null, null, null, null];
  }
}

// shapeHit[0]: time, shapeHit[1]: shape, shapeHit[2]: surface normal, shapeHit[3]: ray, shapeHit[4]: intersection
function findColors(shapeHit, depth) {
  if (shapeHit[0] == null) {
    return createVector(background[0], background[1], background[2]);
  }

  let r = shapeHit[1].material.dr * shapeHit[1].material.ar * ambientLight[0];
  let g = shapeHit[1].material.dg * shapeHit[1].material.ag * ambientLight[1];
  let b = shapeHit[1].material.db * shapeHit[1].material.ab * ambientLight[2];

  for (let i = 0; i < lightList.length; i++) {

    l = createVector(lightList[i].x - shapeHit[4].x, lightList[i].y - shapeHit[4].y, lightList[i].z - shapeHit[4].z);
    l.normalize();
    n = shapeHit[2];
    n.normalize();

    let offset = createVector(0.01 * (lightList[i].x - shapeHit[4].x), 0.01 * (lightList[i].y - shapeHit[4].y), 0.01 * (lightList[i].z - shapeHit[4].z));
    let s_origin = createVector(offset.x + shapeHit[4].x, offset.y + shapeHit[4].y, offset.z + shapeHit[4].z);
    let s_direction = createVector(lightList[i].x - s_origin.x, lightList[i].y - s_origin.y, lightList[i].z - s_origin.z);
    let s_ray = new ray(s_origin, s_direction);
    let cylinderShadowT = hit(s_ray);
    let sphereShadowT = sphereHit(s_ray);

    if ((cylinderShadowT[0] > 0 && cylinderShadowT[0] < 1) || (sphereShadowT[0] > 0 && sphereShadowT[0] < 1)) {
      c_r = createVector(0, 0, 0);
      c_l = createVector(0, 0, 0);
      c_p = createVector(0, 0, 0);
    } else {
      c_r = createVector(shapeHit[1].material.dr, shapeHit[1].material.dg, shapeHit[1].material.db);
      c_l = createVector(lightList[i].r, lightList[i].g, lightList[i].b);
      c_p = createVector(shapeHit[1].material.sr, shapeHit[1].material.sg, shapeHit[1].material.sb);
    }
    r += (c_r.x * c_l.x * max(0, n.dot(l)));
    g += (c_r.y * c_l.y * max(0, n.dot(l)));
    b += (c_r.z * c_l.z * max(0, n.dot(l)));

    // specular highlights
    let eyeRay = createVector(shapeHit[3].origin.x - shapeHit[4].x, shapeHit[3].origin.y - shapeHit[4].y, shapeHit[3].origin.z - shapeHit[4].z);
    eyeRay.normalize();
    let halfway = createVector(l.x + eyeRay.x, l.y + eyeRay.y, l.z + eyeRay.z);
    halfway.normalize();

    r += (c_p.x * c_l.x * pow(max(0, halfway.dot(n)), shapeHit[1].material.pow));
    g += (c_p.y * c_l.y * pow(max(0, halfway.dot(n)), shapeHit[1].material.pow));
    b += (c_p.z * c_l.z * pow(max(0, halfway.dot(n)), shapeHit[1].material.pow));
  }
  // reflection
  // shapeHit[0]: time, shapeHit[1]: shape, shapeHit[2]: surface normal, shapeHit[3]: ray, shapeHit[4]: intersection
  let reflectionColor = createVector(0, 0, 0);
  if (shapeHit[1].material.k_refl > 0 && depth < 3) {
    let reflEyeRay = createVector(shapeHit[3].origin.x - shapeHit[4].x, shapeHit[3].origin.y - shapeHit[4].y, shapeHit[3].origin.z - shapeHit[4].z);
    reflEyeRay.normalize();
    let nDotE = 2 * n.dot(reflEyeRay);
    let reflDir = n.mult(nDotE);
    reflDir = reflDir.sub(reflEyeRay);
    let reflRayOrig = shapeHit[4].add(reflDir.mult(0.0001));
    reflectionColor = findColors(closestHit(new ray(reflRayOrig, reflDir)), depth + 1);
  }
  let colors = createVector(r, g, b);
  return colors.add(reflectionColor.mult(shapeHit[1].material.k_refl));
}

function draw_scene() {
  noStroke();

  // go through all the pixels in the image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // create eye ray
      let k = tan(radians(fov) / 2);
      let transY = (y - height / 2) * (2 * k / height);
      let transX = (x - width / 2) * (2 * k / width);
      let vMag = sqrt(transX * transX + transY * transY + 1);
      let ray1 = new ray(createVector(0, 0, 0), createVector(transX / vMag, transY / vMag, -1 / vMag));

      let currenthit = hit(ray1);
      let currenthitSphere = sphereHit(ray1);
      let finalColor;
      // currenthit[0] is smallestT for cylinder; currenthitSphere[0] is smallestT for sphere
      if ((currenthit[0] == null || currenthitSphere[0] < currenthit[0]) && currenthitSphere[0] != null) {
        sphereIsCloser = true;
        finalColor = findColors(currenthitSphere, 1);
      } else {
        sphereIsCloser = false;
        finalColor = findColors(currenthit, 1);
      }
      fill(255 * finalColor.x, 255 * finalColor.y, 255 * finalColor.z);

      rect(x, height - y, 1, 1);   // make a little rectangle to fill in the pixel
    }
  }
}

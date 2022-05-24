# Ray Tracer
Ray tracing renderer. Capabilities include:
- Reflections
- Sphere Rendering
- Cylinder Rendering
- Specular Shading
- Ambient Shading
- Diffuse Shading

Reflections implemented using recursive eye ray generation.

## Sample Scenes
Reflection  
![Reflection](./s8.PNG)

Ambient Shading  
![Tricolor](./s7.PNG)

Reflection & Specular Highlights  
![Hint of Reflection](./s6.PNG)

Specular Highlights & Ambient Shading  
![Three Spheres](./s5.PNG)

Shadows  
![Face](./s3.PNG)

Cylinder End Caps  
![Filled Rings](./s2.PNG)

Basic Cylinders  
![Two Cylinders](./s1.PNG)

Ambient Shading  
![Sphere](./s4.PNG)

## Implementation Details
1. Initialize scene
2. Recursively cast eye rays for each pixel
3. Detect ray intersection with cylinders / spheres
4. Implement shading equations
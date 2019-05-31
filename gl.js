
//Wrapper for texture and vertex buffer formats

class Format {
    
    constructor(channels, stride, length, type, isFloat, isSignedOrNormalized, channelType, uniformType, name, uniformName){
        this.uniformName = uniformName;
        this.name = name;
        this.size = channels * stride;
        this.length = length;
        this.channels = channels;
        this.stride = stride;
        this.type = type;
        this.isFloat = isFloat;
        this.isSigned = isFloat || isSignedOrNormalized;
        this.isNormalized = isFloat && !isSignedOrNormalized;
        this.channelType = channelType;
        this.uniformType = uniformType;
    }

}

class _Formats {

    constructor(R32f, RG32f, RGB32f, RGBA32f, R32u, RG32u, RGB32u, RGBA32u, R32i, RG32i, RGB32i, RGBA32i, R32b, RG32b, RGB32b, RGBA32b, RGBA32f4){
        this.Undefined = new Format(0, 0, 0, false, false, false, "Undefined");
        this.R32f = R32f;
        this.RG32f = RG32f;
        this.RGB32f = RGB32f;
        this.RGBA32f = RGBA32f;
        this.R32u = R32u;
        this.RG32u = RG32u;
        this.RGB32u = RGB32u;
        this.RGBA32u = RGBA32u;
        this.R32i = R32i;
        this.RG32i = RG32i;
        this.RGB32i = RGB32i;
        this.RGBA32i = RGBA32i;
        this.R32b = R32b;
        this.RG32b = RG32b;
        this.RGB32b = RGB32b;
        this.RGBA32b = RGBA32b;
        this.RGBA32f4 = RGBA32f4;
        this.all = [ 
            this.R32f, this.RG32f, this.RGB32f, this.RGBA32f, 
            this.R32u, this.RG32u, this.RGB32u, this.RGBA32u, 
            this.R32i, this.RG32i, this.RGB32i, this.RGBA32i,
            this.R32b, this.RG32b, this.RGB32b, this.RGBA32b,
            this.RGBA32f4
        ];
    }

    byUniformType(type){

        for(let t in this.all)
            if(this.all[t].uniformType == type)
                return this.all[t];

        return this.Undefined;
    }

}

var Formats;

//Wrapper for model types

class _ModelTypes {

    constructor(lines, lineStrip, lineLoop, triangles, triangleStrip, triangleFan) {
        this.lines = lines;
        this.lineStrip = lineStrip;
        this.lineLoop = lineLoop;
        this.triangles = triangles;
        this.triangleStrip = triangleStrip;
        this.triangleFan = triangleFan;
    }

}

var ModelTypes;

//Wrapper for buffer types

class _BufferTypes {

    constructor(vertex, index, uniform){
        this.vertex = vertex;
        this.index = index;
        this.uniform = uniform;
    }

}

var BufferTypes;

//Wrapper for getting the GL context and setting up enums

class GLWrapper {

    constructor(){

        this.screen = document.getElementsByTagName("canvas")[0];
        this.gl = this.screen.getContext("webgl2");

        if (!this.gl)
            throw new Error("Couldn't obtain webgl2 instance");

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
    
        this.shaderTypeByName = { "vertex": this.gl.VERTEX_SHADER, "fragment": this.gl.FRAGMENT_SHADER };

        Formats = new _Formats(
            new Format(1, 4, 1, this.gl.R32F, true, true, this.gl.FLOAT, this.gl.FLOAT, "R32f", "float"), 
            new Format(2, 4, 1, this.gl.RG32F, true, true, this.gl.FLOAT, this.gl.FLOAT_VEC2, "RG32f", "vec2"), 
            new Format(3, 4, 1, this.gl.RGB32F, true, true, this.gl.FLOAT, this.gl.FLOAT_VEC3, "RGB32f", "vec3"), 
            new Format(4, 4, 1, this.gl.RGBA32F, true, true, this.gl.FLOAT, this.gl.FLOAT_VEC4, "RGBA32f", "vec4"),
            new Format(1, 4, 1, this.gl.R32u, false, false, this.gl.UNSIGNED_INT, this.gl.UNSIGNED_INT, "R32u", "uint"), 
            new Format(2, 4, 1, this.gl.RG32u, false, false, this.gl.UNSIGNED_INT, this.gl.UNSIGNED_INT_VEC2, "RG32u", "uvec2"), 
            new Format(3, 4, 1, this.gl.RGB32u, false, false, this.gl.UNSIGNED_INT, this.gl.UNSIGNED_INT_VEC3, "RGB32u", "uvec3"), 
            new Format(4, 4, 1, this.gl.RGBA32u, false, false, this.gl.UNSIGNED_INT, this.gl.UNSIGNED_INT_VEC4, "RGBA32u", "uvec4"),
            new Format(1, 4, 1, this.gl.R32i, false, true, this.gl.INT, this.gl.UNSIGNED_INT, "R32i", "int"), 
            new Format(2, 4, 1, this.gl.RG32i, false, true, this.gl.INT, this.gl.UNSIGNED_INT_VEC2, "RG32i", "vec2"), 
            new Format(3, 4, 1, this.gl.RGB32i, false, true, this.gl.INT, this.gl.UNSIGNED_INT_VEC3, "RGB32i", "vec3"), 
            new Format(4, 4, 1, this.gl.RGBA32i, false, true, this.gl.INT, this.gl.UNSIGNED_INT_VEC4, "RGBA32i", "vec4"),
            new Format(1, 4, 1, this.gl.R32u, false, false, this.gl.UNSIGNED_INT, this.gl.BOOL, "R32b", "bool"), 
            new Format(2, 4, 1, this.gl.RG32u, false, false, this.gl.UNSIGNED_INT, this.gl.BOOL_VEC2, "RG32b", "bvec2"), 
            new Format(3, 4, 1, this.gl.RGB32u, false, false, this.gl.UNSIGNED_INT, this.gl.BOOL_VEC3, "RGB32b", "bvec3"), 
            new Format(4, 4, 1, this.gl.RGBA32u, false, false, this.gl.UNSIGNED_INT, this.gl.BOOL_VEC4, "RGBA32b", "bvec4"),
            new Format(4, 4, 4, this.gl.RGBA32F, true, true, this.gl.FLOAT, this.gl.FLOAT_MAT4, "RGBA32f4", "mat4")
        );

        ModelTypes = new _ModelTypes(
            this.gl.LINES, this.gl.LINE_STRIP, this.gl.LINE_LOOP, this.gl.TRIANGLES,
            this.gl.TRIANGLE_STRIP, this.gl.TRIANGLE_FAN
        );

        BufferTypes = new _BufferTypes(
            this.gl.ARRAY_BUFFER, this.gl.ELEMENT_ARRAY_BUFFER, this.gl.UNIFORM_BUFFER
        );
    }

}

var gl;

//Wrapper for compiling and handling reflection of shaders

class ShaderModule {

    //Compile this shader
    //source is an array of strings
    //You don't have to specify version or float precision

    constructor(source, type){

        this.source = source;
        this.type = type;

        this.shader = gl.gl.createShader(gl.shaderTypeByName[type]);
        gl.gl.shaderSource(this.shader, "#version 300 es\nprecision mediump float;\n" + source.join('\n'));

        gl.gl.compileShader(this.shader);

        if(!gl.gl.getShaderParameter(this.shader, gl.gl.COMPILE_STATUS)){
            var error = gl.gl.getShaderInfoLog(this.shader);
            console.log(error);
            throw new Error("Can't compile " + type + " shader");
        }

    }

    //Delete data related to this shader code

    delete(){
        gl.gl.deleteShader(this.shader);
    }

}

class ShaderVariable {

    constructor(type, size, name, binding){
        this.type = type;
        this.size = size;
        this.name = name;
        this.binding = binding;
    }

}

class Shader {

    //Construct a shader with reflection data from shader sources;
    //{ "vertex": sourceAsArrayOfStrings, "fragment": sourceAsArrayOfStrings }

    constructor(sources){

        //Compile modules

        var modules = [];
        
        for(var source in sources)
            modules.push(new ShaderModule(sources[source], source));

        //Link modules

        this.program = gl.gl.createProgram();

        for(var module in modules)
            gl.gl.attachShader(this.program, modules[module].shader);

        gl.gl.linkProgram(this.program);

        if(!gl.gl.getProgramParameter(this.program, gl.gl.LINK_STATUS)){
            var error = gl.gl.getProgramInfoLog(this.program);

            console.log(error);
            throw new Error("Can't link shader");
        }

        //Clean up shader modules

        for(var module in modules)
            modules[module].delete();

        //Get attributes

        this.attributeCount = gl.gl.getProgramParameter(this.program, gl.gl.ACTIVE_ATTRIBUTES);
        this.uniformCount = gl.gl.getProgramParameter(this.program, gl.gl.ACTIVE_UNIFORMS);
        this.uniformBlockCount = gl.gl.getProgramParameter(this.program, gl.gl.ACTIVE_UNIFORM_BLOCKS);

        this.attributes = [];
        this.uniforms = [];
        this.uniformBlocks = [];

        for(var i = 0; i < this.attributeCount; ++i){
            let info = gl.gl.getActiveAttrib(this.program, i);
            this.attributes.push(new ShaderVariable(Formats.byUniformType(info.type), info.size, info.name, i));
        }

        for(var i = 0; i < this.uniformCount; ++i){
            let info = gl.gl.getActiveUniform(this.program, i);
            this.uniforms.push(new ShaderVariable(Formats.byUniformType(info.type), info.size, info.name, gl.gl.getUniformLocation(this.program, info.name)));
        }

        console.log("Created shader with", this.attributes, "attributes and", this.uniforms, "uniforms and", this.uniformBlocks, "uniform blocks");
    }

    //Bind a shader for operations

    bind(){
        gl.gl.useProgram(this.program);
    }

    //Delete all data associated to the shader

    delete(){
        gl.gl.deleteProgram(this.program);
    }

    //Setting a variable in the shader

    set(uniformName, value){

        for(var i in this.uniforms){

            var uniform = this.uniforms[i];

            if(uniform.name == uniformName){

                if(uniform.type.length == 1){
                    if(uniform.type.isFloat) {

                        if(uniform.type.channels == 1)
                            gl.gl.uniform1fv(uniform.binding, value);
                        else if(uniform.type.channels == 2)
                            gl.gl.uniform2fv(uniform.binding, value);
                        else if(uniform.type.channels == 3)
                            gl.gl.uniform3fv(uniform.binding, value);
                        else if(uniform.type.channels == 4)
                            gl.gl.uniform4fv(uniform.binding, value);
                        else
                            throw new Error("Floating point type was not supported and could not be set");

                    } else if(uniform.type.isSigned){

                        if(uniform.type.channels == 1)
                            gl.gl.uniform1iv(uniform.binding, value);
                        else if(uniform.type.channels == 2)
                            gl.gl.uniform2iv(uniform.binding, value);
                        else if(uniform.type.channels == 3)
                            gl.gl.uniform3iv(uniform.binding, value);
                        else if(uniform.type.channels == 4)
                            gl.gl.uniform4iv(uniform.binding, value);
                        else
                            throw new Error("Signed int type was not supported and could not be set");

                    } else {                    //TODO: Bools

                        if(uniform.type.channels == 1)
                            gl.gl.uniform1uv(uniform.binding, value);
                        else if(uniform.type.channels == 2)
                            gl.gl.uniform2uv(uniform.binding, value);
                        else if(uniform.type.channels == 3)
                            gl.gl.uniform3uv(uniform.binding, value);
                        else if(uniform.type.channels == 4)
                            gl.gl.uniform4uv(uniform.binding, value);
                        else
                            throw new Error("Unsigned int type was not supported and could not be set");

                    }
                } else if(uniform.type.length == 4) {

                    if(uniform.type.channels != 4)
                        throw new Error("Matrix width was not supported and could not be set");

                    if(uniform.type.isFloat)
                        gl.gl.uniformMatrix4fv(uniform.binding, true, value.data);
                    else 
                        throw new Error("Matrix type wasn't supported and could not be set");


                } else
                    throw new Error("Matrix height was not supported and could not be set");
                
                break;
            }

        }

    }

}

//Wrapper on handling buffers;

class GPUBuffer {

    //Construct a GPU buffer using a typed array

    constructor(type, data){

        this.type = type;
        this.size = data.BYTES_PER_ELEMENT * data.length;
        this.stride = data.BYTES_PER_ELEMENT;
        this.elements = data.length;
        
        this.buffer = gl.gl.createBuffer();
        gl.gl.bindBuffer(this.type, this.buffer);
        gl.gl.bufferData(this.type, data, this.type == BufferTypes.uniform ? gl.gl.DYNAMIC_DRAW : gl.gl.STATIC_DRAW);

        var error;
        if(error = gl.gl.getError())
            throw new Error("Couldn't create buffer: " + error);

        console.log("Created buffer with " + this.elements + " elements, " + this.stride + " stride and " + this.size + " length");

    }

    bind(){
        gl.gl.bindBuffer(this.type, this.buffer);
    }

    delete(){
        gl.gl.deleteBuffer(this.buffer);
    }

}

//Wrapper on handling models;

class Model {

    //Creating a (number of) vertex buffer(s) and/or index buffer with the data provided
    //
    //  Example:
    //  new Model([
    //      { "buffer": vbo, "pos": Formats.RG32f, "color": Formats.RGB32f }
    //  ], ModelTypes.triangleStrip, ibo);
    //
    //Where vbo is a typed array (Float32Array for example)
    //And ibo is either null, left out or a typed integer array.

    constructor(vbos, type, ibo = null){

        this.vbos = vbos;
        this.type = type;
        this.ibo = ibo;

        if(this.ibo){
            this.indexBuffer = new GPUBuffer(BufferTypes.index, ibo);
            this.indices = ibo.length;
            this.iboType = ibo.BYTES_PER_ELEMENT == 1 ? gl.gl.UNSIGNED_BYTE : (ibo.BYTES_PER_ELEMENT == 2 ? gl.gl.UNSIGNED_SHORT : gl.gl.UNSIGNED_INT);
        } else this.indices = 0;
        
        this.vertexBuffers = [];

        for(var vbo in vbos){
            var buffer = vbos[vbo]["buffer"];
            this.vertexBuffers[vbo] = new GPUBuffer(BufferTypes.vertex, buffer);
        }

        this.vao = gl.gl.createVertexArray();
        gl.gl.bindVertexArray(this.vao);

        if(this.ibo)
            this.indexBuffer.bind();

        this.attributeCount = 0;

        this.strides = [];

        for(var vbo in vbos){

            var stride = 0;

            for(var attribute in vbos[vbo])
                if(attribute != "buffer")
                    stride += vbos[vbo][attribute].size;

            if(stride == 0)
                throw new Error("VBO has to specify the attributes of the vertex data.");

            this.strides.push(stride);

            this.vertices = vbos[vbo]["buffer"].length * vbos[vbo]["buffer"].BYTES_PER_ELEMENT / stride;

            var attributeOffset = 0;

            for(var attribute in vbos[vbo])
                if(attribute != "buffer"){

                    var format = vbos[vbo][attribute];

                    gl.gl.vertexAttribPointer(this.attributeCount, format.channels, format.channelType, gl.gl.FALSE, stride, attributeOffset);
                    gl.gl.enableVertexAttribArray(this.attributeCount);

                    this.attributeCount += 1;
                    attributeOffset += format.size;
                }
        }

        var error;
        if(error = gl.gl.getError())
            throw new Error("Couldn't create model: " + error);

        console.log("Created model with " + this.vertices + " vertices and " + this.indices + " indices");

    }

    //Binding the model for drawing operations

    bind(){
        gl.gl.bindVertexArray(this.vao);
    }

    //Draw commands for this model

    draw(instances = 1){
        if(this.ibo)
            gl.gl.drawElementsInstanced(this.type, this.indices, this.iboType, 0, instances);
        else 
            gl.gl.drawArraysInstanced(this.type, 0, this.vertices, instances);
    }

    //Clean up all data related to this model

    delete(){

        gl.gl.deleteVertexArray(this.vao);

        if(this.ibo)
           this.indexBuffer.delete();

        for (var vertexBuffer in this.vertexBuffers)
            this.vertexBuffers[vertexBuffer].delete();

    }

}

//Matrix math

class Vector {

    constructor(data){
        this.data = data;
    }

    length(){
        var size = 0;
        for(var i in data)
            size += data[i] * data[i];
        return size;
    }

    normalize(){
        var cpy = new Vector(this.data.slice(0));
        for(var i in data)
            cpy = data[i] / length();
        return cpy;
    }

    minus(other){
        var cpy = new Vector(this.data.slice(0));
        for(var i in data)
            cpy = data[i] - other.data[i];
        return cpy;
    }

}

class OMath {

    static pi(){
        return 3.14159265358979;
    }

    static toRad(deg){
        return deg / 180 * OMath.pi();
    }

    static toDeg(rad){
        return rad / OMath.pi() * 180;
    }

}

class Matrix {

    constructor(data){
        this.data = data;
    }

    mul(mat){
        
        var cpy = new Matrix(this.data.slice(0));

        for(var j = 0; j < 4; ++j)
            for(var i = 0, k = j * 4; i < 4; ++i)
                cpy.data[i + k] =                               //horizontal . vertical
                    mat.data[k + 0] * this.data[i + 0 ] + 
                    mat.data[k + 1] * this.data[i + 4 ] + 
                    mat.data[k + 2] * this.data[i + 8 ] + 
                    mat.data[k + 3] * this.data[i + 12];

        return cpy;
    }

    at(x, y){
        return this.data[x % 4 + y % 4 * 4];
    }

    set(x, y, val){
        this.data[x % 4 + y % 4 * 4] = val;
    }

    print(){
        console.log(this.data[0], this.data[1], this.data[2], this.data[3]);
        console.log(this.data[4], this.data[5], this.data[6], this.data[7]);
        console.log(this.data[8], this.data[9], this.data[10], this.data[11]);
        console.log(this.data[12], this.data[13], this.data[14], this.data[15]);
    }

    static scale(x, y, z){
        return new Matrix([ 
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);
    }

    static translate(x, y, z){
        return new Matrix([ 
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    }

    static rotateZ(zDeg){
        var zRad = OMath.toRad(zDeg);
        return new Matrix([ 
            Math.cos(zRad), -Math.sin(zRad), 0, 0,
            Math.sin(zRad), Math.cos(zRad), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static rotateY(yDeg){
        var yRad = OMath.toRad(yDeg);
        return new Matrix([ 
            Math.cos(yRad), 0, Math.sin(yRad), 0,
            0, 1, 0, 0,
            -Math.sin(yRad), 0, Math.cos(yRad), 0,
            0, 0, 0, 1
        ]);
    }

    static rotateX(xDeg){
        var xRad = OMath.toRad(xDeg);
        return new Matrix([ 
            1, 0, 0, 0,
            0, Math.cos(xRad), -Math.sin(xRad), 0,
            0, Math.sin(xRad), Math.cos(xRad), 0,
            0, 0, 0, 1
        ]);
    }

    static perspective(aspect, fovDeg, near, far){
        var scale = 1 / Math.tan(OMath.toRad(fovDeg) * 0.5);
        return new Matrix([ 
            scale / aspect, 0, 0, 0,
            0, scale, 0, 0,
            0, 0, -((far + near) / (far - near)), -1,
            0, 0, -(2 * far * near / (far - near)), 0
        ]);
    }

    static rotate(xDeg, yDeg, zDeg){
        return Matrix.rotateX(xDeg).mul(Matrix.rotateY(yDeg).mul(Matrix.rotateZ(zDeg)));
    }

    static view(eyeX, eyeY, eyeZ, xDeg, yDeg, zDeg){
        var translate = Matrix.translate(-eyeX, -eyeY, -eyeZ);
        var rotate = Matrix.rotate(xDeg, yDeg, zDeg);
        return translate.mul(rotate);
    }

    static transform(posX, posY, posZ, xDeg, yDeg, zDeg, xScale, yScale, zScale){
        var translate = Matrix.translate(posX, posY, posZ);
        var rotate = Matrix.rotate(xDeg, yDeg, zDeg);
        var scale = Matrix.scale(xScale, yScale, zScale);
        return translate.mul(rotate.mul(scale));
    }

    static identity(){
        return scale(1, 1, 1);
    }

}

window.addEventListener('load', function(){
    gl = new GLWrapper();
});
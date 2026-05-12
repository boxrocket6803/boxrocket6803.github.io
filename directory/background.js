import * as Graphics from "/shared/engine/graphics.js"
import * as Shader from "/shared/engine/shader.js"
import {Texture} from "/shared/engine/texture.js"

Graphics.Init(document.querySelector('canvas'));

const pipeline = Graphics.Device.createRenderPipeline({
    layout: 'auto',
    vertex: {
        module: await Shader.Load('shared/shaders/advent_vert.wgsl'),
    },
    fragment: {
        module: await Shader.Load('shared/shaders/advent_frag.wgsl'),
        targets: [
            {format: navigator.gpu.getPreferredCanvasFormat()},
        ],
    },
    primitive: {topology: 'triangle-list'},
});

const tex = Texture.Load('shared/assets/fx_rain.btex', 3)

function Draw() {
    const cmd = Graphics.Device.createCommandEncoder();
    const pass = cmd.beginRenderPass({
        colorAttachments: [
            {
                view: Graphics.Context.getCurrentTexture().createView(),
                clearValue: [0.125, 0.125, 0.125, 1],
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
    });
    pass.setPipeline(pipeline);
    pass.draw(6);
    pass.end();
    Graphics.Device.queue.submit([cmd.finish()]);
    requestAnimationFrame(Draw);
}
requestAnimationFrame(Draw);

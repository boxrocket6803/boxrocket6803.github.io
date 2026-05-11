const canvas = document.querySelector('canvas');
canvas.width = canvas.clientWidth * window.devicePixelRatio;
canvas.height = canvas.clientHeight * window.devicePixelRatio;

const device = await (await navigator.gpu?.requestAdapter())?.requestDevice();

const context = canvas.getContext('webgpu');
context.configure({device, format: navigator.gpu.getPreferredCanvasFormat()});

const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
        module: device.createShaderModule({code: (await fetch('shared/shaders/advent_vert.wgsl').then(r => r.text()))}),
    },
    fragment: {
        module: device.createShaderModule({code: (await fetch('shared/shaders/advent_frag.wgsl').then(r => r.text()))}),
        targets: [
            {format: navigator.gpu.getPreferredCanvasFormat()},
        ],
    },
    primitive: {topology: 'triangle-list'},
});

function Draw() {
    const cmd = device.createCommandEncoder();
    const pass = cmd.beginRenderPass({
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                clearValue: [0.125, 0.125, 0.125, 1],
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
    });
    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.end();
    device.queue.submit([cmd.finish()]);
    requestAnimationFrame(Draw);
}
requestAnimationFrame(Draw);

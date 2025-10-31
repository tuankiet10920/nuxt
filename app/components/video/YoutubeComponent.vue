<script setup>
/**
 * * MÔ TẢ THÔNG TIN OPTIONS
 * 
 * autoplay           - Tự động phát video ngay khi trang tải xong.
 * mute               - Tắt tiếng video.
 * controls           - Quyết định có hiển thị thanh điều khiển (Play/Pause, âm lượng, thanh thời gian) ở cuối video hay không.
 * rel                - Kiểm soát việc hiển thị các video liên quan (Related Videos) khi video kết thúc.
 * loop               - Lặp lại video sau khi phát xong.
 * modestbranding     - Giảm thiểu logo YouTube ở góc dưới bên phải của trình phát.
 * showinfo           - Ẩn thông tin video (tiêu đề, tên kênh) ở thanh phía trên trình phát.
 * 
 * * tất cả các key sẽ có giá trị là 0 (false) hoặc 1 (true)
 */

const props = defineProps({
    // embededUrl: đường dẫn trong embeded đến ? có si hoặc không
    embededUrl: {
        type: String,
        required: true
    },
    options: {
        type: Object,
        required: true
    }
})

const url = ref('')

const generateEmbededUrl = () => {
    const isQuestExists = props.embededUrl.includes('?')
    let optionUrl = isQuestExists ? '' : '?'
    let index = 0
    if (Object.keys(props.options).length > 0) {
        for (const [key, value] of Object.entries(props.options)) {
            if (index == 0 && !isQuestExists) {
                optionUrl += `${key}=${value}`
                index++
                continue
            }
            optionUrl += `&${key}=${value}`
            index++
        }
    }
    url.value = props.embededUrl + optionUrl
}

onMounted(() => {
    generateEmbededUrl()
})

</script>
<template>
    <div>
        <div class="video-banner-container">
            <iframe :src="url" title="YouTube video player" frameborder="0" allow=""
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
        </div>
    </div>
</template>
<style scoped>
.video-banner-container {
    /* Đặt kích thước cho vùng banner (ví dụ: full màn hình hoặc 70vh) */
    width: 100%;
    height: 100vh;
    /* Giữ nguyên 100vh để lấp đầy chiều cao viewport */
    position: relative;
    overflow: hidden;
    /* Cần thiết để ẩn phần thừa của video và tiêu đề bị cắt */
}

/* Ẩn tiêu đề và căn video lấp đầy */
.video-banner-container iframe {
    /* 1. Kích thước để đảm bảo lấp đầy (dựa trên tỉ lệ 16:9) */
    position: absolute;
    top: 50%;
    left: 50%;

    /* Dùng min-width/height và transform để luôn lấp đầy container (Cover) */
    min-width: 100%;
    min-height: 100%;
    width: 177.77vh;
    /* Tăng chiều rộng lên 100vh * (16/9) */
    height: 56.25vw;
    /* Tăng chiều cao lên 100vw * (9/16) */

    /* Căn giữa và DỊCH CHUYỂN LÊN TRÊN để ẩn thanh tiêu đề (khoảng 40-50px) */
    transform: translate(-50%, -50%);

    /* Tùy chỉnh: Dịch chuyển thêm lên trên để cắt tiêu đề (khoảng 40px) */
    margin-top: -40px;
}

.video-banner-container::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0);
    z-index: 2;
    top: 0;
    left: 0;
}
</style>
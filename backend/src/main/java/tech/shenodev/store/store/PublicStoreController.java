package tech.shenodev.store.store;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class PublicStoreController {

    @GetMapping("/stores")
    public Object listStores() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/store/{storeId}/products")
    public Object storeProducts(@PathVariable String storeId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/store/{storeId}/product/{productId}")
    public Object productDetail(@PathVariable String storeId, @PathVariable String productId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

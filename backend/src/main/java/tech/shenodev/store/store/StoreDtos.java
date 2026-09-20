package tech.shenodev.store.store;

import java.time.Instant;

public class StoreDtos {

    public record StoreResponse(String id, String name, Instant createdAt) {

        public static StoreResponse from(Store s) {
            return new StoreResponse(s.getId(), s.getName(), s.getCreatedAt());
        }
    }
}

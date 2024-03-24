package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.exception.ApiExceptionDetails;
import com.example.Pizzeriabackend.model.request.CreateOrderRequest;
import com.example.Pizzeriabackend.model.request.OrderStatusRequest;
import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.service.OrderService;
import com.example.Pizzeriabackend.service.SseService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@Tag(name = "Order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private SseService sseService;

    @PostMapping
    @Operation(
            summary = "Create new order",
            responses = {
                    @ApiResponse(description = "Order created", responseCode = "201"),
                    @ApiResponse(description = "Request body filled improperly", responseCode = "400",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiExceptionDetails.class)))

            }
    )
    public ResponseEntity<Map<String, OrderDTO>> createOrder(@RequestBody CreateOrderRequest createOrderRequest) {
        OrderDTO order = orderService.createOrder(createOrderRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", order));
    }

    @GetMapping
    @Operation(
            summary = "Get all my orders",
            responses = {@ApiResponse(description = "Orders fetched", responseCode = "200")}
    )
    public ResponseEntity<Map<String, List<OrderDTO>>> getMyOrders() {
        List<OrderDTO> orders = orderService.getMyOrders();
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @DeleteMapping("/cancel/{id}")
    @Operation(
            summary = "Cancel order of given id if belongs to requester",
            responses = {@ApiResponse(description = "Orders fetched", responseCode = "200")}
    )
    public ResponseEntity<Void> cancelOrder(@PathVariable long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{lookupId}")
    public ResponseEntity<Map<String, OrderDTO>> getOrderByLookupId(@PathVariable String lookupId) {
        OrderDTO order = orderService.getOrderByLookupId(lookupId);
        return ResponseEntity.ok(Map.of("result", order));
    }

    // admin required -----------------------------
    @DeleteMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
            summary = "Delete all orders",
            responses = {@ApiResponse(description = "All Orders deleted", responseCode = "204")}
    )
    public ResponseEntity<Void> deleteAllOrders() {
        orderService.deleteAllOrders();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
            summary = "Delete order of given id",
            responses = {@ApiResponse(description = "Order deleted", responseCode = "204")}
    )
    public ResponseEntity<Void> deleteOrder(@PathVariable long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // worker required ----------------------------
    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @Operation(
            summary = "Get all existing orders",
            responses = {@ApiResponse(description = "Orders fetched", responseCode = "200")}
    )
    public ResponseEntity<Map<String, List<OrderDTO>>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @GetMapping("/unfinished")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @Operation(
            summary = "Get all unfinished orders for staff frontend application",
            responses = {@ApiResponse(description = "Orders fetched", responseCode = "200")}
    )
    public ResponseEntity<Map<String, List<OrderDTO>>> getUnfinishedOrders() {
        List<OrderDTO> orders = orderService.getUnfinishedOrders();
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @Operation(
            summary = "Get order of given id",
            responses = {@ApiResponse(description = "Order fetched", responseCode = "200")}
    )
    public ResponseEntity<Map<String, OrderDTO>> getOrder(@PathVariable long id) {
        OrderDTO order = orderService.getOrder(id);
        return ResponseEntity.ok(Map.of("result", order));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @Operation(
            summary = "Get all orders of user with given id",
            responses = {@ApiResponse(description = "Orders fetched", responseCode = "200")}
    )
    public ResponseEntity<Map<String, List<OrderDTO>>> getUserOrders(@PathVariable long userId) {
        List<OrderDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @PutMapping("/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @Operation(
            summary = "Update order status",
            responses = {@ApiResponse(description = "Order status updated", responseCode = "200")}
    )

    public ResponseEntity<Void> updateOrderRequest(@RequestBody OrderStatusRequest orderStatusRequest) {
        orderService.updateOrderStatus(orderStatusRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping({"/subscribe", "/subscribe/{id}"})
    @Hidden
    public SseEmitter orderSubscription(@PathVariable(required = false) Long id) {
        return sseService.orderSubscription(id);
    }

}

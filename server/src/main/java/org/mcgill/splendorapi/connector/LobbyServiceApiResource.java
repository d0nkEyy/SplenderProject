package org.mcgill.splendorapi.connector;

import java.util.List;
import org.mcgill.splendorapi.connector.model.Game;
import org.mcgill.splendorapi.connector.model.GameService;
import org.mcgill.splendorapi.connector.model.MinimalGameService;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Feign interface for connecting our splendor service to the lobby service.
 */
@FeignClient(url = "${lobby-service.infra.api.url}", name = "lobbyServiceApi")
public interface LobbyServiceApiResource {
  @GetMapping("/online")
  String getOnline();

  @GetMapping("/gameservices")
  List<MinimalGameService> getGameServices(@RequestParam("access_token") String token);

  // Documentation doesn't have a return type, may be none
  @PutMapping(value = "/gameservices/{gameService}", consumes = "application/json")
  void putGameService(@PathVariable("gameService") String gameServiceName,
                      @RequestBody GameService gameService,
                      @RequestHeader("Authorization") String token);

  @GetMapping("/gameservices/{gameService}")
  List<GameService> getGameService(@RequestParam("access_token") String token,
                                   @PathVariable("gameService") String gameService);

  @DeleteMapping("/gameservices/{gameService}")
  String deleteGameService(@PathVariable("gameService") String gameService,
                           @RequestHeader("Authorization") String token);

  @GetMapping("/gameservices/{gameService}/savegames")
  List<Game> getGamesFromService(@PathVariable("gameService") String gameService,
                                 @RequestParam("access_token") String token);

  @DeleteMapping("/gameservices/{gameService}/savegames")
  String deleteGamesFromService(@PathVariable("gameService") String gameService,
                                @RequestParam("access_token") String token);

  @PutMapping("/gameservices/{gameService}/savegames/{saveGameId}")
  String putGameToService(@PathVariable("gameService") String gameService,
                          @RequestParam("access_token") String token,
                          @PathVariable("saveGameId") String gameId);

  @GetMapping("/gameservices/{gameService}/savegames/{saveGameId}")
  Game getGameFromService(@PathVariable("gameService") String gameService,
                          @RequestParam("access_token") String token,
                          @PathVariable("saveGameId") String gameId);

  @DeleteMapping("/gameservices/{gameService}/savegames/{saveGameId}")
  Object deleteGameFromService(@PathVariable("gameService") String gameService,
                               @RequestParam("access_token") String token,
                               @PathVariable("saveGameId") String gameId);
}

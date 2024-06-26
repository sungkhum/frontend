import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AppRoutingModule, RouteNames } from "../../app-routing.module";
import { GlobalVarsService } from "../../global-vars.service";
import { TutorialStatus } from "../../backend-api.service";
import { TradeCreatorModalComponent } from "../../trade-creator-page/trade-creator-modal/trade-creator-modal.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { TransferDesoModalComponent } from "../../transfer-deso/transfer-deso-modal/transfer-deso-modal.component";
import { ProfileEntryResponse } from "deso-protocol";

@Component({
  selector: "wallet-actions-dropdown",
  templateUrl: "./wallet-actions-dropdown.component.html",
})
export class WalletActionsDropdownComponent implements OnInit {
  @Input() hodlingUser: ProfileEntryResponse;
  @Input() inTutorial: boolean = false;
  @Input() isHighlightedCreator: boolean = false;
  @Output() isSelling = new EventEmitter<any>();
  AppRoutingModule = AppRoutingModule;
  showIcons = false;

  showSellOnly: boolean = false;
  RouteNames = RouteNames;
  iconHideTimeout: NodeJS.Timer;
  buyTradeType = this.globalVars.RouteNames.BUY_CREATOR;
  sellTradeType = this.globalVars.RouteNames.SELL_CREATOR;
  transferTradeType = this.globalVars.RouteNames.TRANSFER_CREATOR;

  constructor(public globalVars: GlobalVarsService, private modalService: BsModalService) {}

  hideIcons(): void {
    this.showIcons = false;
  }

  stopIconHide() {
    clearTimeout(this.iconHideTimeout);
  }

  openBuyCreatorCoinModal(event, tradeType: string) {
    event.stopPropagation();
    this.isSelling.emit();
    const initialState = { username: this.hodlingUser.Username, tradeType, inTutorial: this.inTutorial };
    // In cases in the mobile tutorial where the window height is small, we want the dialog box to go to the top to prevent
    // it from blocking content.
    const dialogClass =
      this.inTutorial && this.globalVars.isMobile() && window.innerHeight < 765
        ? ""
        : "modal-dialog-centered buy-deso-modal";
    this.modalService.show(TradeCreatorModalComponent, {
      class: dialogClass,
      initialState,
    });
    this.showIcons = false;
  }

  openSendCloutModal(event) {
    event.stopPropagation();
    const initialState = { creatorToPayInput: this.hodlingUser };
    this.modalService.show(TransferDesoModalComponent, {
      class: "modal-dialog-centered buy-deso-modal",
      initialState,
    });
  }

  ngOnInit(): void {
    if (this.inTutorial && this.globalVars.loggedInUser.TutorialStatus === TutorialStatus.INVEST_OTHERS_BUY) {
      this.showSellOnly = true;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {LolChallengeService} from '../../core/services/lolchallenge.service';
import {Parser} from 'json2csv';
import {saveAs} from 'file-saver';
import { Web3Service } from 'src/app/core/services/web3service';
import { Toast } from 'src/app/_constants/SwalToast'; 

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.css']
})
export class WithdrawalsComponent implements OnInit {
  result: any = null;

  page = 1;
  limit = 10;
  withdrawals: any;
  totalDocs: any;
  isAllSelected = false;
  isUserSelected = false;
  currentStatus;
  totalMiningRate: any = 0
  tmpWalletAddress: any = "0xCEa686dfd92Ee8884B7A6c55Ed028341E2c7e898"

  isLoader = false;
  constructor(private lolChallengeService: LolChallengeService, public web3Service: Web3Service) { }

  ngOnInit(): void {
    this.getWithdrawals('All');
    this.getTotalMiningRate(this.tmpWalletAddress )
  }

  async getTotalMiningRate(walletAddress ){
    await this.web3Service.beforeProgressing();

    let result = await this.web3Service.fetchUserInventory(walletAddress );
    this.totalMiningRate = result.totalRate;
  }

  async transferAddress(amount: any, address: any ){
    this.isLoader = true;
    try{
      await this.web3Service.beforeProgressing()
      await this.web3Service.runWithdrawBalanceByUser(address, amount );
    }catch{
      this.isLoader = false;
    }
    this.isLoader = false;
  }

  getWithdrawals(withdrawalStatus, page?: any) {
    this.currentStatus = withdrawalStatus;
    this.lolChallengeService.getWithdrawals({page: page ? page : '1', status: withdrawalStatus}).subscribe( (res: any) => {
      this.withdrawals = res.data.docs;
      this.totalDocs = res.data.totalDocs;
      this.withdrawals.map(w => {
        w.isSelected = false;
      });
    });
  }

  selecAlltUser(event) {
    this.withdrawals.forEach(cus => {
      cus.isSelected = event;
    });
    this.isUserSelected = event;
    this.isAllSelected = event;
  }

  selectUser() {
    const isAllSelected = this.withdrawals.every(d => {
      return d.isSelected;
    });
    this.isAllSelected = isAllSelected;

    // Check any customer is selected
    setTimeout( () => {
      const isUserSelected = this.withdrawals.some(d => {
        return d.isSelected;
      });
      this.isUserSelected = isUserSelected;
    }, 1000);
  }

  changeStatus(status) {
    let userForChangeStatus = this.withdrawals.reduce(function (filtered, option) {
      // console.log("beforefilter",filtered);
      // console.log("beforeoption",option);

      if (option.isSelected && option.status==='Pending') {
        filtered.push(option._id);
      }
      // console.log("afterfiltered",filtered);
      // console.log("afteroption",option);

      return filtered;
    }, []);
    console.log(userForChangeStatus);


    if(typeof userForChangeStatus !== 'undefined' && userForChangeStatus.length === 0)
    {
      alert("No transactions to update | Sorry you cant change already completed or cancelled transactions");
    }
    else
    {
      if(status==="Cancelled")
      {
        this.lolChallengeService.makerefunds(userForChangeStatus, status).subscribe( (res: any) => {
      this.getWithdrawals(this.currentStatus);
    });
      }
      else{
   this.lolChallengeService.changeStatus(userForChangeStatus, status).subscribe( (res: any) => {
      this.getWithdrawals(this.currentStatus);
    });
      }
    }
  }

  onPageChange(page, status) {
    this.page = page;
    this.getWithdrawals(status,page);
  }

  downloadAll() {
    this.lolChallengeService.getAllWithdrawals().subscribe(data => {
      const fields = ["userName", "userEmail","amount", "fee", "address", "method", "createdAt"];
      data = data.data.map(e => {
        e.userName = e.user.fullName;
        e.userEmail = e.user.email;
        delete e.user;
        return e;
      })
      const p = new Parser({fields});
      const csvData = p.parse(data);
      console.log(csvData)
      const csv = new Blob([csvData], {type: 'text/csv;charset=utf-8'});
      saveAs(csv, "withdrawals.csv");

    })
  }
    downloadRefund() {
    this.lolChallengeService.getAllRefund().subscribe(data => {
      const fields = ["userName", "userEmail","amount", "fee", "address", "method", "createdAt"];
      data = data.data.map(e => {
        e.userName = e.user.fullName;
        e.userEmail = e.user.email;
        delete e.user;
        return e;
      })
      const p = new Parser({fields});
      const csvData = p.parse(data);
      console.log(csvData)
      const csv = new Blob([csvData], {type: 'text/csv;charset=utf-8'});
      saveAs(csv, "Refunds.csv");

    })
  }
    downloadCancelled() {
    this.lolChallengeService.getAllCancelled().subscribe(data => {
      const fields = ["userName", "userEmail","amount", "fee", "address", "method", "createdAt"];
      data = data.data.map(e => {
        e.userName = e.user.fullName;
        e.userEmail = e.user.email;
        delete e.user;
        return e;
      })
      const p = new Parser({fields});
      const csvData = p.parse(data);
      console.log(csvData)
      const csv = new Blob([csvData], {type: 'text/csv;charset=utf-8'});
      saveAs(csv, "Cancelled.csv");

    })
  }
    downloadAllComplete() {
    this.lolChallengeService.getAllComplete().subscribe(data => {
      const fields = ["userName", "userEmail","amount", "fee", "address", "method", "createdAt"];
      data = data.data.map(e => {
        e.userName = e.user.fullName;
        e.userEmail = e.user.email;
        delete e.user;
        return e;
      })
      const p = new Parser({fields});
      const csvData = p.parse(data);
      console.log(csvData)
      const csv = new Blob([csvData], {type: 'text/csv;charset=utf-8'});
      saveAs(csv, "Completed.csv");

    })
  }
}
